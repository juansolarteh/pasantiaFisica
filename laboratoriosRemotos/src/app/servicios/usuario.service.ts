import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ResultadoServicio } from '../modelos/resultadoServicio';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private col = this.firestr.firestore.collection('Usuarios');

  constructor(private firestr: AngularFirestore) { }

  async defineRol(correo: string) {
    const querySnapShot = this.col.where('correo', '==', correo).get();
    var flag = true;
    (await querySnapShot).forEach((doc) => {
      flag = false
      localStorage.setItem('rol', doc.data()['rol'])
      if (doc.data()['nombre'] == undefined || doc.data()['nombre'] == '') {
        this.firestr.doc(doc.ref).update({ nombre: localStorage.getItem('name') })
      }
      localStorage.setItem('idUsuario', doc.id)
      return
    })
    if (flag) {
      const nombre = localStorage.getItem('name')
      const email = localStorage.getItem('email')
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

  async getUser(idUser: string) {
    const documentSnapShot = this.col.doc(idUser).get();
    return (await documentSnapShot).data()
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

  async deleteUser(correo: string, rol: string) {
    var materias: DocumentReference[] = [];
    try {
      const querySnapShot = this.col.where('correo', '==', correo).get();
      (await querySnapShot).forEach((doc) => {
        if (rol === 'Docente') {
          materias = doc.data()['materias']
        }
        this.firestr.doc(doc.ref).delete()
        return
      })
    } finally {
      return materias
    }
  }

  async deleteSubjectsOfUsers(subjectRef: DocumentReference){
    const querySnapShot = this.col.where('materias', 'array-contains', subjectRef).get();
    (await querySnapShot).forEach(doc => {
      var materias: DocumentReference[] = doc.data()['materias']
      materias = materias.filter((i) => i.path !== subjectRef.path)
      doc.ref.update('materias', materias)
    })
  }

  async addUser(user: Usuario) {
    var result: ResultadoServicio = {
      approved: false,
      message: 'Fallo de conexion, intente de nuevo'
    }
    const dominio = user.correo.split('@')[1].toString()
    try {
      if (dominio == "unicauca.edu.co") {
        const querySnapShot = this.col.where('correo', '==', user.correo).get();
        if ((await querySnapShot).size == 0) {
          this.col.add(user)
          result = {
            approved: true,
            message: 'Usuario registardo exitosamente'
          }
        } else {
          result = {
            approved: false,
            message: 'El usuario con correo ' + user.correo + ' ya se encuentra registrado'
          }
        }
      } else {
        result = {
          approved: false,
          message: 'El dominio no pertenece a @unicauca.edu.co'
        }
      }
    } finally {
      return result
    }
  }
}
