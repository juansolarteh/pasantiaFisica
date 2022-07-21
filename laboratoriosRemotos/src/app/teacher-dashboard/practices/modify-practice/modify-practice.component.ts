import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Timestamp } from '@firebase/firestore';
import * as moment from 'moment';
import { Subject, finalize, Subscription } from 'rxjs';
import { FileLink } from 'src/app/models/FileLink';
import { FormValidators } from 'src/app/models/FormValidators';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Plant } from 'src/app/models/Plant';
import { Practice, PracticeNameDate } from 'src/app/models/Practice';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';
import { imageFile, TypeFiles } from 'src/environments/typeFiles';

@Component({
  selector: 'app-modify-practice',
  templateUrl: './modify-practice.component.html',
  styleUrls: ['./modify-practice.component.css']
})
export class ModifyPracticeComponent implements OnInit, OnDestroy {

  @Input() practiceId!: string;
  @Output() updatePractice: EventEmitter<ObjectDB<PracticeNameDate> | undefined> = new EventEmitter();

  practice!: ObjectDB<Practice>;
  plant!: Plant;
  practiceForm!: FormGroup;
  constants: ObjectDB<number[]>[] = []
  units: any = [];
  fileLinks: FileLink[] = [];
  accept: string = TypeFiles
  fieldFeatures: any = {
    name: ['nombre', 5, 60],
    description: ['descripcion', 400],
    end: ['fin de la practica'],
    plant: ['planta'],
    start: ['inicio de la practica'],
  }
  startSubmit = false;
  flag = true;
  uploadFiles = 0

  stepComplete!: number
  complete = new Subject<boolean>();

  submitResult: any
  subsComplete!: Subscription

  //aux for compare changes
  filesComparator: FileLink[] = [];

  constructor(
    private readonly practiceSvc: PracticeService,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private readonly plantSvc: PlantService,
    private readonly storageSvc: StorageService,
    private subjectSvc: SubjectService,
  ) { }

  ngOnDestroy(): void {
    if (this.subsComplete) {
      this.subsComplete.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.stepComplete = 0;
    this.practiceForm = this.initForm();
    this.practiceForm.get('plant')?.disable();
    this.practiceSvc.getPracticeById(this.practiceId).then(pDB => {
      this.practice = pDB;
      this.setValuesForm();
      this.setFiles();
      this.fileLinks.forEach(fl => this.filesComparator.push(fl));
    })
  }

  async setValuesForm() {
    this.practiceForm.get('name')?.setValue(this.practice.getObjectDB().getNombre());
    this.practiceForm.get('description')?.setValue(this.practice.getObjectDB().getDescripcion())
    let date = new Date(this.practice.getObjectDB().getInicio().seconds * 1000);
    let dateFormated = moment(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate());
    dateFormated.add(1, 'months')
    dateFormated.add(1, 'd')
    this.practiceForm.get('start')?.setValue(dateFormated.format('YYYY-MM-DD'));
    date = new Date(this.practice.getObjectDB().getFin().seconds * 1000);
    dateFormated = moment(date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate());
    dateFormated.add(1, 'months');
    dateFormated.add(1, 'd')
    this.practiceForm.get('end')?.setValue(dateFormated.format('YYYY-MM-DD'));
    this.plantSvc.getPlant(this.practice.getObjectDB().getPlanta()).then(plant => {
      this.plant = plant
      this.practiceForm.get('plant')?.setValue(this.plant.getNombre());
    })
    this.plantSvc.getConstantsDB(this.practice.getObjectDB().getPlanta().id).then(cons => {
      this.constants = cons;
      this.units = this.plant.getUnidades()
      this.addControlsForm();
    });
  }

  setFiles() {
    if (this.practice.getObjectDB().getDocumentos()) {
      this.practice.getObjectDB().getDocumentos().forEach(path => {
        let splt = path.split('.')
        let ext = splt[1]
        splt = path.split('/')
        let name = ''
        for (let i = 2; i < splt.length; i++) {
          name += splt[i]
        }
        this.fileLinks.push(new FileLink(name, ext, '', undefined, path))
      })
      this.fileLinks.forEach(fl => {
        this.storageSvc.getTypeFile(fl.getLink()!).subscribe(type => {
          fl.setImage(imageFile(type))
        })
        this.storageSvc.getUrlFile(fl.getLink()!).subscribe(url => {
          fl.setLink(url)
        })
      })
    }
  }

  addControlsForm() {
    let keys = Object.keys(this.units);
    keys.forEach(k => {
      this.practiceForm.addControl(k, new FormControl('', Validators.required))
    })
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: [undefined, [
        Validators.required,
        Validators.minLength(this.fieldFeatures['name'][1]),
        Validators.maxLength(this.fieldFeatures['name'][2])
      ]],
      description: [undefined, Validators.maxLength(this.fieldFeatures['description'][1])],
      start: [undefined, [Validators.required]],
      end: [undefined, [Validators.required]],
      plant: [undefined, Validators.required]
    })
  }

  getErrorMessage(field: string) {
    if (this.practiceForm.get(field)?.errors?.['required']) {
      return 'Debes llenar el campo';
    } else if (this.practiceForm.get(field)?.errors?.['maxlength']) {
      return 'El campo ' + this.fieldFeatures[field][0] + ' debe tener menos de '
        + this.fieldFeatures[field][2] + ' caracteres';
    } else if (this.practiceForm.get(field)?.errors?.['noPrevDatesFromNow']) {
      return 'No puede cambiar el ' + this.fieldFeatures[field][0] + ' para antes de la fecha actual';
    } else if (this.practiceForm.get(field)?.hasError('noPrevDates')) {
      return 'La fecha de inicio no puede ser despues o igual a la fecha de finalización';
    }
    return this.practiceForm.get(field)?.errors?.['minlength'] ?
      'El campo ' + this.fieldFeatures[field][0] + ' debe tener mas de '
      + this.fieldFeatures[field][1] + ' caracteres' : '';
  }

  openFile(fileLink: FileLink) {
    if (fileLink.getLink()) {
      const downloadLink = document.createElement('a')
      downloadLink.href = fileLink.getLink()!
      downloadLink.setAttribute('preview', fileLink.getName())
      downloadLink.setAttribute('target', 'blank')
      document.body.appendChild(downloadLink)
      downloadLink.click()
    }
  }

  onRemoveFile(fileLink: FileLink) {
    this.fileLinks = this.fileLinks.filter((f) => f !== fileLink)
  }

  onFileSelected($event: any) {
    if (this.fileLinks.length < 3) {
      const uploadFile = $event.target.files[0]
      const type: string = uploadFile.type
      if (type && type != '') {
        if (type.includes('image') || type.includes('video') || type.includes('audio') || this.accept.includes(type)) {
          let imgFile = imageFile(type)
          let nameFile: string = uploadFile.name;
          let file: FileLink = new FileLink(nameFile, nameFile.split('.')[1], imgFile, uploadFile)
          this.createLink(uploadFile, file)
        } else {
          this.openSnackBar('Solo se aceptan archivos pdf, word, excel, powerpoint, imagenes, audios y videos')
        }
      } else {
        this.openSnackBar('Solo se aceptan archivos pdf, word, excel, powerpoint, imagenes, audios y videos')
      }
    } else {
      this.openSnackBar('Solo es podible agregar 3 archivos a la practica')
    }
  }

  createLink(file: any, fileLink: FileLink) {
    try {
      const link = window.URL.createObjectURL(file);
      fileLink.setLink(link)
      this.fileLinks.push(fileLink);
      return
    } catch (e) {
      return
    }
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(6000)
  }

  verifyDate(field: string, event: any) {
    if (!this.practiceForm.get(field)!.hasValidator(FormValidators.noPrevDatesFromNow)) {
      this.practiceForm.get(field)!.setValidators(FormValidators.noPrevDatesFromNow);
      this.practiceForm.get(field)!.setValue(event.target.value);
    }
  }

  onUpload() {
    this.flag = false;
    this.startSubmit = true;

    ///agendas borrar

    this.replacePractice();

    this.practiceSvc.updatePractice(this.practice.getObjectDB(), this.practice.getId()).then(() => {
      this.subsComplete = this.complete.asObservable().subscribe(com => {
        if (com && this.stepComplete === 2) {
          this.updatePractice.emit(new ObjectDB(new PracticeNameDate(
            this.practiceForm.get('name')?.value,
            this.practice.getObjectDB().getFecha_creacion()
          ), this.practice.getId()));
        }
      })
      if (this.constants.length > 0) {
        let constDB = this.constants.map(cons => {
          let valueCons: number[] = this.practiceForm.get(cons.getId())?.value
          let map = new Map()
          valueCons.forEach(vc => {
            map.set(vc.toString(), cons.getObjectDB()[vc - 1])
          })
          return new ObjectDB<any>(Object.fromEntries(map), cons.getId())
        })
        this.practiceSvc.addConstantsById(constDB, this.practice.getId());
      }
      this.changeFiles();
    })
  }

  changeFiles() {
    if (this.fileLinks !== this.filesComparator) {
      let newFiles = this.fileLinks.filter((fl) => fl.getFile());
      let oldFileNames = this.fileLinks.filter((fl) => !fl.getFile()).map(fl => {
        return fl.getName()
      })
      this.uploadFiles = this.fileLinks.length - newFiles.length
      this.deleteOtherfiles();
      this.uploadDocuments(newFiles, oldFileNames);
    } else {
      console.log('iguales')
      this.stepComplete = 2;
      this.complete.next(true)
    }
  }

  deleteOtherfiles() {
    let toDelete = this.filesComparator.filter(fc => !this.fileLinks.some(f => f === fc))
    let pathFilesToDelete = toDelete.map(fl => {
      return this.subjectSvc.getRefSubjectSelected().id + '/' + this.practice.getId() + '/' + fl.getName();
    })
    this.storageSvc.deleteFiles(pathFilesToDelete)
    this.stepComplete += 1;
    this.complete.next(true)
  }

  replacePractice() {
    this.practice.getObjectDB().setDescripcion(this.practiceForm.get('description')?.value);
    let date = moment(this.practiceForm.get('end')?.value)
    date.add(23, 'h')
    date.add(59, 'm')
    date.add(59, 's')
    this.practice.getObjectDB().setFin(Timestamp.fromDate(new Date(date.format('YYYY-MM-DD HH:mm:ss'))));
    this.practice.getObjectDB().setInicio(Timestamp.fromDate(new Date(this.practiceForm.get('start')?.value)));
    this.practice.getObjectDB().setNombre(this.practiceForm.get('name')?.value);
  }

  uploadDocuments(files: FileLink[], oldFileNames: string[]) {
    let pathFile = this.subjectSvc.getRefSubjectSelected().id + '/' + this.practice.getId() + '/';
    if (files.length > 0) {
      files.forEach(fl => {
        let task = this.storageSvc.uploadFile(pathFile + fl.getName(), fl.getFile())
        task.snapshotChanges().pipe(
          finalize(() => {
            this.uploadFiles += 1
            fl.setLink(pathFile + fl.getName())
            if (this.uploadFiles == this.fileLinks.length) {
              let pathOldFiles = oldFileNames.map(ofn => {
                return pathFile + ofn
              })
              console.log(pathFile)
              this.practiceSvc.addPathDocs(pathOldFiles.concat(
                files.map(fl => {
                  return fl.getLink()!
                })), this.practice.getId());
              this.stepComplete += 1;
              this.complete.next(true)
            }
          })
        ).subscribe()
      });
    } else {
      let pathOldFiles = oldFileNames.map(ofn => {
        return pathFile + ofn
      })
      this.practiceSvc.addPathDocs(pathOldFiles, this.practice.getId())
      this.stepComplete += 1;
      this.complete.next(true)
    }
  }
}
