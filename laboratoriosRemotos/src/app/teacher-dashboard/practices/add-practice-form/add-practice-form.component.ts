import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentReference, Timestamp } from '@firebase/firestore';
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
    name: ['nombre', 5, 30],
    description: ['descripcion', 300],
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

  constructor(private sanitizer: DomSanitizer, private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar, private plantSvc: PlantService, private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog, private subjectSvc: SubjectService, private storageSvc: StorageService,
    private practiceSvc: PracticeService) { }

  ngOnDestroy(): void {
    this.subsComplete.unsubscribe()
  }

  ngOnInit() {
    this.plantSvc.getNamePlantsDB().then(plants => {
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
      this.practiceForm.addControl(k, new FormControl('', Validators.required))
    })
  }

  onSubmit(startDate?: string) {
    this.flag = false;
    this.startSubmit = true;
    let sd: Timestamp;
    let a = DocumentReference
    if (startDate) {
      sd = Timestamp.fromDate(new Date(startDate))
    } else {
      sd = Timestamp.fromDate(new Date())
    }
    const practice = new Practice(
      this.practiceForm.get('name')?.value,
      Timestamp.fromDate(new Date()),
      sd,
      Timestamp.fromDate(new Date(this.practiceForm.get('end')?.value)),
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
            Timestamp.fromDate(new Date(this.practiceForm.get('end')?.value))
          ), refPractice.id));
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
        this.addControlsForm();
        this.changeDetector.markForCheck();
        this.flag = true;
      });
    }
  }

  event: any
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

  uploadDocuments(pathPractice: string) {
    let pathFile = this.subjectSvc.getRefSubjectSelected().id + '/' + pathPractice + '/';
    this.fileLinks.forEach(fl => {
      let task = this.storageSvc.uploadFile(pathFile + '/' + fl.getName(), fl.getFile())
      let a = task.snapshotChanges().pipe(
        finalize(() => {
          this.uploadFiles += 1
          fl.setLink(pathFile + '/' + fl.getName())
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
}
