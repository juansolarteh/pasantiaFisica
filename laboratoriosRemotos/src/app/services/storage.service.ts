import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  uploadFile(filePath: string, file: any) {
    return this.storage.upload(filePath, file);
  }

  deleteFilesFromPractice(subjectPath: string, practicePath: string){
    let a = this.storage.ref('/as').delete()
  }
}
