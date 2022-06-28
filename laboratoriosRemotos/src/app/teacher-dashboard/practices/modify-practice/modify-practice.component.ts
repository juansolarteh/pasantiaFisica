import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { FileLink } from 'src/app/models/FileLink';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Plant } from 'src/app/models/Plant';
import { Practice } from 'src/app/models/Practice';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';
import { StorageService } from 'src/app/services/storage.service';
import { imageFile, TypeFiles } from 'src/environments/typeFiles';

@Component({
  selector: 'app-modify-practice',
  templateUrl: './modify-practice.component.html',
  styleUrls: ['./modify-practice.component.css']
})
export class ModifyPracticeComponent implements OnInit {

  @Input() practiceId!: string;
  practice!: ObjectDB<Practice>;
  plant!: Plant;
  practiceForm!: FormGroup;
  constants: ObjectDB<number[]>[] = []
  units: any = [];
  fileLinks: FileLink[] = [];
  accept: string = TypeFiles
  fieldFeatures: any = {
    name: ['nombre', 5, 30],
    description: ['descripcion', 300],
    end: ['fin de practica'],
    plant: ['planta'],
  }
  startSubmit = false;
  flag = true;
  filesWithImage = new Subject<boolean>()

  constructor(
    private readonly practiceSvc: PracticeService,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private readonly plantSvc: PlantService,
    private readonly storageSvc: StorageService
  ) { }

  ngOnInit(): void {
    this.practiceForm = this.initForm();
    this.practiceForm.get('plant')?.disable();
    this.practiceSvc.getPracticeById(this.practiceId).then(pDB => {
      this.practice = pDB;
      this.setValuesForm();
      this.setFiles();
    })
  }

  async setValuesForm() {
    this.practiceForm.get('name')?.setValue(this.practice.getObjectDB().getNombre());
    this.practiceForm.get('description')?.setValue(this.practice.getObjectDB().getDescripcion())
    let date = new Date(this.practice.getObjectDB().getInicio().seconds * 1000);
    let m = date.getMonth().toString().length == 1 ? '0' + date.getMonth().toString() : date.getMonth();
    let d = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate();
    let dateFormated = date.getFullYear() + '-' + m + '-' + d;
    this.practiceForm.get('start')?.setValue(dateFormated);
    date = new Date(this.practice.getObjectDB().getFin().seconds * 1000);
    m = date.getMonth().toString().length == 1 ? '0' + date.getMonth().toString() : date.getMonth();
    d = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate();
    dateFormated = date.getFullYear() + '-' + m + '-' + d;
    this.practiceForm.get('end')?.setValue(dateFormated);
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
    this.practice.getObjectDB().getDocumentos().forEach(path => {
      let splt = path.split('.')
      let ext = splt[1]
      splt = splt[0].split('_')
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
      plant: [undefined, Validators.required],
      documents: [undefined]
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

  onUpload() {
    return 'ya se actualizo supuestamente'
  }
}
