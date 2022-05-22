import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDocs } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  col = this.firestr.firestore.collection('Usuarios');

  constructor(private firestr: AngularFirestore) { }

  async defineRol(correo: string) {
    const query = this.col.where('correo', '==', correo)
    const documentData = getDocs(query);
    (await documentData).forEach((doc) => {
      localStorage.setItem('rol', doc.data()['rol'])
      return
    })
  }
}
