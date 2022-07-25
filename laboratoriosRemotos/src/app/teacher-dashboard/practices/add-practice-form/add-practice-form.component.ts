import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Timestamp } from '@firebase/firestore';
import * as moment from 'moment';
import { finalize, Subject, Subscription } from 'rxjs';
import { FileLink } from 'src/app/models/FileLink';
import { FormValidators } from 'src/app/models/FormValidators';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Plant } from 'src/app/models/Plant';
import { PracticeNameDate, Practice } from 'src/app/models/Practice';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';
import { imageFile, TypeFiles } from 'src/environments/typeFiles';

@Component({
  selector: 'app-add-practice-form',
  templateUrl: './add-practice-form.component.html',
  styleUrls: ['./add-practice-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPracticeFormComponent implements OnInit, OnDestroy {

  @Output() addPractice: EventEmitter<ObjectDB<PracticeNameDate> | undefined> = new EventEmitter();

  plants: ObjectDB<Plant>[] = []
  fileLinks: FileLink[] = [];
  accept: string = TypeFiles
  practiceForm!: FormGroup;
  fieldFeatures: any = {
    name: ['nombre', 5, 60],
    description: ['descripcion', 400],
    end: ['fin de practica'],
    plant: ['planta'],
  }
  constants: ObjectDB<number[]>[] = []
  units: any = [];
  flag = false;
  endDate: string = ''
  startSubmit = false;
  complete = new Subject<boolean>();
  subsComplete!: Subscription
  uploadFiles = 0

  a = 50

  range: any;

  constructor(private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar, private plantSvc: PlantService, private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog, private subjectSvc: SubjectService, private storageSvc: StorageService,
    private practiceSvc: PracticeService) { }

  ngOnDestroy(): void {
    if (this.subsComplete) {
      this.subsComplete.unsubscribe()
    }
  }

  ngOnInit() {
    this.plantSvc.getPlantsDB().then(plants => {
      this.plants = plants;
    })
    this.practiceForm = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(this.fieldFeatures['name'][1]),
        Validators.maxLength(this.fieldFeatures['name'][2])
      ]],
      description: ['', Validators.maxLength(this.fieldFeatures['description'][1])],
      end: ['', [Validators.required, FormValidators.noPrevDatesFromNow]],
      plant: ['', Validators.required],
      documents: ['']
    })
  }

  addControlsForm() {
    let contols = this.practiceForm.controls;
    for (let control in contols) {
      if (control !== 'name' && control !== 'description' && control !== 'end' && control !== 'plant' && control !== 'documents') {
        this.practiceForm.removeControl(control);
      }
    }
    let keys = Object.keys(this.units);
    keys.forEach(k => {
      if (this.range) {
        if (this.range[k]) {
          let cons = this.constants.find(c => c.getId() === k)
          let min = cons?.getObjectDB()[0]!
          let max = cons?.getObjectDB()[1]!
          this.practiceForm.addControl(k, new FormControl('', [Validators.required, Validators.min(min), Validators.max(max)]))
        } else {
          this.practiceForm.addControl(k, new FormControl('', Validators.required))
        }
      } else {
        this.practiceForm.addControl(k, new FormControl('', Validators.required))
      }
    })
  }

  onSubmit(startDate?: string) {
    this.flag = false;
    this.startSubmit = true;
    let sd: Timestamp;
    if (startDate) {
      let aux = moment(startDate)
      sd = Timestamp.fromDate(new Date(aux.format('YYYY-MM-DD HH:mm:ss')))
    } else {
      sd = Timestamp.fromDate(new Date())
    }
    let creationDate = Timestamp.fromDate(new Date())
    let fnPractice = moment(this.practiceForm.get('end')?.value).hour(20)
    const practice = new Practice(
      this.practiceForm.get('name')?.value,
      creationDate,
      sd,
      Timestamp.fromDate(new Date(fnPractice.format('YYYY-MM-DD HH:mm:ss'))),
      this.plantSvc.getPlantRefFromId(this.practiceForm.get('plant')?.value),
      this.subjectSvc.getRefSubjectSelected(),
      this.practiceForm.get('description')?.value,
      this.fileLinks.map(fl => {
        return fl.getLink()!
      })
    )
    this.practiceSvc.addPractice(practice).then(refPractice => {
      this.subsComplete = this.complete.asObservable().subscribe(com => {
        if (com) {
          this.addPractice.emit(new ObjectDB(new PracticeNameDate(
            this.practiceForm.get('name')?.value,
            creationDate
          ), refPractice.id));
        }
      })
      if (this.constants.length > 0) {
        let constDB = this.constants.map(cons => {
          let map = new Map()
          console.log(cons)
          if(this.range[cons.getId()]){
            let valueCons: number = this.practiceForm.get(cons.getId())?.value
            map.set('0', cons.getObjectDB()[0])
            map.set('1', valueCons)
          }else{
            let valueCons: number[] = this.practiceForm.get(cons.getId())?.value
            valueCons.forEach(vc => {
              console.log(vc)
              map.set(vc.toString(), cons.getObjectDB()[vc - 1])
            })
          }
          return new ObjectDB<any>(Object.fromEntries(map), cons.getId())
        })
        this.practiceSvc.addConstants(constDB, refPractice);
      }
      if (this.fileLinks.length > 0) {
        this.uploadDocuments(refPractice.id);
      } else {
        this.complete.next(true)
      }
    })
  }

  onCancel() {
    this.addPractice.emit(undefined);
  }

  getErrorMessage(field: string) {
    if (this.practiceForm.get(field)?.errors?.['required']) {
      return 'Debes llenar el campo';
    } else if (this.practiceForm.get(field)?.errors?.['maxlength']) {
      return 'El campo ' + this.fieldFeatures[field][0] + ' debe tener menos de '
        + this.fieldFeatures[field][1] + ' caracteres';
    } else if (this.practiceForm.get(field)?.errors?.['noPrevDatesFromNow']) {
      return 'La fecha final no puede ser antes de la fecha actual';
    } else if (this.practiceForm.get(field)?.errors?.['min']) {
      let cons = this.constants.find(c => c.getId() === field)
      let min = cons?.getObjectDB()[0]!
      return 'El campo no puede ser menor a ' + min;
    } else if (this.practiceForm.get(field)?.errors?.['max']) {
      let cons = this.constants.find(c => c.getId() === field)
      let max = cons?.getObjectDB()[1]!
      return 'El campo no puede ser mayor a ' + max;
    }
    return this.practiceForm.get(field)?.errors?.['minlength'] ?
      'El campo ' + this.fieldFeatures[field][0] + ' debe tener mas de '
      + this.fieldFeatures[field][1] + ' caracteres' : '';
  }

  onChangeSelect() {
    let idPlant: string = this.practiceForm.get('plant')?.value;
    if (idPlant) {
      this.flag = false
      this.plantSvc.getConstantsDB(idPlant).then(cons => {
        this.constants = cons;
        this.units = this.plants.find((p) => p.getId() === idPlant)?.getObjectDB().getUnidades();
        this.range = this.plants.find((p) => p.getId() === idPlant)?.getObjectDB().getRango();
        this.addControlsForm();
        this.changeDetector.markForCheck();
        this.flag = true;
      });
    }
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

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(6000)
  }

  createLink(file: File, fileLink: FileLink) {
    try {
      const link = window.URL.createObjectURL(file);
      fileLink.setLink(link)
      this.fileLinks.push(fileLink);
      return
    } catch (e) {
      return
    }
  }

  uploadDocuments(pathPractice: string) {
    let pathFile = this.subjectSvc.getRefSubjectSelected().id + '/' + pathPractice + '/';
    this.fileLinks.forEach(fl => {
      let task = this.storageSvc.uploadFile(pathFile + fl.getName(), fl.getFile())
      task.snapshotChanges().pipe(
        finalize(() => {
          this.uploadFiles += 1
          fl.setLink(pathFile + fl.getName())
          if (this.uploadFiles == this.fileLinks.length) {
            this.practiceSvc.addPathDocs(this.fileLinks.map(fl => {
              return fl.getLink()!
            }), pathPractice);
            this.complete.next(true)
          }
        })
      ).subscribe()
    })
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

  onSchedulePractice(contentDialog: any) {
    this.endDate = this.practiceForm.get('end')?.value;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.startSubmit = true;
        this.changeDetector.markForCheck();
        this.onSubmit(result)
      }
    });
  }

  sliderChange(value: number, nameControl: string) {
    this.practiceForm.get(nameControl)?.setValue(value)
  }
}
