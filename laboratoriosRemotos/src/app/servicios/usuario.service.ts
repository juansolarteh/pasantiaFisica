import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc, setDoc } from '@firebase/firestore';
import { Diccionario } from '../modelos/diccionario';
import { User } from '../modelos/user';
import { CursoService } from './curso.service';
import { PracticaService } from './practica.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  col = this.firestr.firestore.collection('Usuarios');

  constructor(private firestr: AngularFirestore, private cursoSvc: CursoService, private practicaSvc: PracticaService) { }

  async defineRol(correo: string) {
    const querySnapShot = this.col.where('correo', '==', correo).get();
    (await querySnapShot).forEach((doc) =>{
      localStorage.setItem('rol', doc.data()['rol'])
      if (doc.data()['nombre'] == undefined || doc.data()['nombre'] == ''){
        setDoc(doc.ref, {nombre: localStorage.getItem('nombre')})
      }
      return
    })
  }

  async getWorkers() {
    var listWorkers: User[] = []
    const querySnapShot = this.col.where('rol', 'in', ['Docente', 'Laboratorista']).get();
    (await querySnapShot).forEach((doc) => {
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

  async deleteUser(correo: string, rol: string): Promise<boolean> {
    try {
      const querySnapShot = this.col.where('correo', '==', correo).get();
      (await querySnapShot).forEach((doc) => {
        if (rol === 'Docente') {
          const materias: Diccionario<DocumentReference> = doc.data()['materias']
          console.log(materias['Mecanica'])
   //       materias.forEach((refMateria) =>{
     //       console.log(refMateria)
       //     this.practicaSvc.deleteFromCursoReference(refMateria)
         //   this.cursoSvc.deleteFromReference(refMateria)
         // })
        }
        //deleteDoc(doc.ref)
        return true
      })
      return true
    } catch {
      return false
    }
  }

  addUser(user: User) {
    this.col.add({
      name: 'prueba',
      email: 'prueba',
      rol: 'Docente'
    })
  }
}
