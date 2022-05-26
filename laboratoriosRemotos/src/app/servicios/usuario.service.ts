import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc, setDoc } from '@firebase/firestore';
import { Diccionario } from '../modelos/diccionario';
import { Usuario } from '../modelos/usuario';
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
    (await querySnapShot).forEach((doc) => {
      console.log('nooo entra')
      localStorage.setItem('rol', doc.data()['rol'])
      if (doc.data()['nombre'] == undefined || doc.data()['nombre'] == '') {
        setDoc(doc.ref, { nombre: localStorage.getItem('nombre') })
      }
      return
    })
    if ((await querySnapShot).size < 1) {
      const nombre = localStorage.getItem('name')
      const email = localStorage.getItem('email')
      console.log(nombre);
      console.log(email);
      localStorage.setItem('rol', 'Estudiante')
      if (nombre && email) {
        const user: Usuario = {
          nombre: nombre,
          correo: email,
          rol: 'Estudiante'
        }
        this.addUser(user)
      }
    }
  }

  async getWorkers() {
    var listWorkers: Usuario[] = []
    const querySnapShot = this.col.where('rol', 'in', ['Docente', 'Laboratorista']).get();
    (await querySnapShot).forEach((doc) => {
      const us = doc.data()
      listWorkers.push(
        {
          nombre: us['nombre'],
          correo: us['correo'],
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

  addUser(user: Usuario) {
    this.col.add(user)
  }
}
