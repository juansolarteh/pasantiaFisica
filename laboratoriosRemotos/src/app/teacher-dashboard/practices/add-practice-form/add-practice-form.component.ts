import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DocumentReference, Timestamp } from '@firebase/firestore';
import { FileLink } from 'src/app/models/FileLink';
import { FormValidators } from 'src/app/models/FormValidators';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Plant } from 'src/app/models/Plant';
import { PracticeNameDate, Practice } from 'src/app/models/Practice';
import { PlantService } from 'src/app/services/plant.service';
import { SubjectService } from 'src/app/services/subject.service';
import { imageFile, TypeFiles } from 'src/environments/typeFiles';

@Component({
  selector: 'app-add-practice-form',
  templateUrl: './add-practice-form.component.html',
  styleUrls: ['./add-practice-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPracticeFormComponent implements OnInit {

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

  constructor(private sanitizer: DomSanitizer, private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar, private plantSvc: PlantService, private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog, private subjectSvc: SubjectService) { }

  ngOnInit() {
    this.plantSvc.getNamePlantsDB().then(plants => {
      this.plants = plants;
    })
    this.practiceForm = this.initForm();
    this.onValueChanges()
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
    let sd: Timestamp;
    let a = DocumentReference
    if (startDate) {
      sd = Timestamp.fromDate(new Date(startDate))
    } else {
      sd = Timestamp.fromDate(new Date())
    }
    this.uploadDocuments();
    let practice = new Practice(
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
  }

  onCancel() {
    this.addPractice.emit(undefined);
  }

  onValueChanges() {
    let a = this.practiceForm.get('end')?.valueChanges.subscribe(val => {
      console.log(val);
    })
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

  uploadDocuments() {
    this.fileLinks.forEach(fl => {
      this.extractBase64(fl.getFile()).then((fileBase64: any) => {
        console.log(fileBase64.base)
      })
    })
  }

  downloadFile(fileLink: FileLink) {
    if (fileLink.getLink()) {
      const downloadLink = document.createElement('a')
      downloadLink.href = fileLink.getLink()!
      downloadLink.setAttribute('download', fileLink.getName())
      document.body.appendChild(downloadLink)
      downloadLink.click()
    }
  }

  onRemoveFile(fileLink: FileLink) {
    this.fileLinks = this.fileLinks.filter((f) => f !== fileLink)
  }

  extractBase64 = async ($doc: any) => new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL($doc);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
      return
    } catch (e) {
      return null
    }
  })

  onSchedulePractice(contentDialog: any) {
    this.endDate = this.practiceForm.get('end')?.value;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.onSubmit(result)
      }
    });
  }


  /*  archivosFuera: any[] = [];
   subirArchivos() {
     let archivos = this.event.target.files;
     let aux;
     for (let index = 0; index < archivos.length; index++) {
       let reader = new FileReader();
       reader.readAsDataURL(archivos[index]);
       reader.onloadend = async () => {
         this.archivosFuera.push(reader.result);
         aux = await this.subirArchivosFire('prueba/' + archivos[index].name, reader.result);
         await this.practicaNueva.archivos.push(aux);
       }
     }
   }
 
   async subirArchivosFire(nombre: string, imgBase64: any): Promise<any> {
     let respuesta = await this.storageRef.child(nombre).putString(imgBase64, 'data_url');
     return await respuesta.ref.getDownloadURL();
   } */
}
