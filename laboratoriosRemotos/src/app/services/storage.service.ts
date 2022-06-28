import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subject } from 'rxjs';
import { imageFile } from 'src/environments/typeFiles';
import { FileLink } from '../models/FileLink';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  uploadFile(filePath: string, file: any) {
    return this.storage.upload(filePath, file);
  }

  deleteFile(pathFile: string) {
    return this.storage.ref(pathFile).delete()
  }

  deleteFiles(pathFiles: string[]) {
    if (pathFiles) {
      pathFiles.forEach(pf => {
        this.deleteFile(pf)
      })
    }
  }

  getTypeFile(pathFile: string) {
    let type = new Subject<string>();
    this.storage.ref(pathFile).getMetadata().subscribe(md => {
      type.next(md.contentType)
    })
    return type
  }

  getUrlFile(pathFile: string) {
    let url = new Subject<string>();
    this.storage.ref(pathFile).getDownloadURL().subscribe(URL => {
      url.next(URL)
    })
    return url
  }
}