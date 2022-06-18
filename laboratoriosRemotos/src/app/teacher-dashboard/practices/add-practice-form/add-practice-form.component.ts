import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FileLink } from 'src/app/models/FileLink';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { imageFile, TypeFiles } from 'src/environments/typeFiles';

@Component({
  selector: 'app-add-practice-form',
  templateUrl: './add-practice-form.component.html',
  styleUrls: ['./add-practice-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPracticeFormComponent implements OnInit {

  plants: ObjectDB<String>[] = [
    new ObjectDB('ley de Hoooke', '1'),
    new ObjectDB('caida libre', '2'),
    new ObjectDB('ley de Hoooke', '3')
  ]
  fileLinks: FileLink[] = [];
  practiceForm!: FormGroup;
  fieldLenght: any = {
    name: ['nombre', 5, 30],
    description: ['descripcion', 300],
    end: ['fin de practica'],
    plant: ['planta'],
  }
  accept: string = TypeFiles

  constructor(private sanitizer: DomSanitizer, private readonly fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.practiceForm = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(this.fieldLenght['name'][1]),
        Validators.maxLength(this.fieldLenght['name'][2])
      ]],
      description: ['', Validators.maxLength(this.fieldLenght['description'][1])],
      end: ['', [Validators.required]],
      plant: ['', Validators.required],
    })
  }

  onSubmit() {
    console.log(this.practiceForm.get('documents')?.value)
  }

  getErrorMessage(field: string) {
    if (this.practiceForm.get(field)?.errors?.['required']) {
      return 'Debes llenar el campo';
    } else if (this.practiceForm.get(field)?.errors?.['maxlength']) {
      return 'El campo ' + this.fieldLenght[field][0] + ' debe tener menos de '
        + this.fieldLenght[field][1] + ' caracteres';
    }
    return this.practiceForm.get(field)?.errors?.['minlength'] ?
      'El campo ' + this.fieldLenght[field][0] + ' debe tener mas de '
      + this.fieldLenght[field][1] + ' caracteres' : '';
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
          let file: FileLink = new FileLink(nameFile, nameFile.split('.')[1], imgFile)
          this.createLink(uploadFile, file)
        }else{
          this.openSnackBar('Solo se aceptan archivos pdf, word, excel, powerpoint, imagenes, audios y videos')
        }
      } else {
        this.openSnackBar('Solo se aceptan archivos pdf, word, excel, powerpoint, imagenes, audios y videos')
      }
    } else {
      this.openSnackBar('Solo es podible agregar 3 archivos a la practica')
    }
    /* this.extractBase64(uploadFile).then((image: any) => {
      console.log(image)
    }) */
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

  downloadFile(fileLink: FileLink) {
    if (fileLink.getLink()) {
      const downloadLink = document.createElement('a')
      downloadLink.href = fileLink.getLink()!
      downloadLink.setAttribute('download', fileLink.getName())
      document.body.appendChild(downloadLink)
      downloadLink.click()
    }
  }

  onRemoveFile(fileLink: FileLink){
    this.fileLinks = this.fileLinks.filter((f) => f !== fileLink)
  }

  extractBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      console.log(unsafeImg)
      const downloadLink = document.createElement('a')
      downloadLink.href = unsafeImg
      downloadLink.setAttribute('download', 'prueba')
      document.body.appendChild(downloadLink)
      downloadLink.click()
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
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
