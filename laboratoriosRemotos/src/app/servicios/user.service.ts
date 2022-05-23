import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { deleteDoc, getDocs } from '@firebase/firestore';
import { User } from '../modelos/user';

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

  async getWorkers() {
    var listWorkers: User[] = []
    const query = this.col.where('rol', 'in', ['Docente', 'Laboratorista'])
    const documentData = getDocs(query);
    (await documentData).forEach((doc) => {
      const us = doc.data()
      listWorkers.push(
        {
          name: us['nombre'],
          email: us['correo'],
          rol: us['rol']
        }
      )
    })
    return listWorkers
  }

  async deleteUser(correo: string): Promise<boolean> {
    try {
      const query = this.col.where('correo', '==', correo)
      const documentData = getDocs(query);
      (await documentData).forEach((doc) => {
        deleteDoc(doc.ref)
        return true
      })
      return true
    } catch {
      return false
    }
  }
}
