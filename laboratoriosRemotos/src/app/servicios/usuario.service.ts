import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Diccionario } from '../modelos/diccionario';
import { ResultadoServicio } from '../modelos/resultadoServicio';
import { Usuario } from '../modelos/usuario';
import { CursoService } from './curso.service';
import { GruposService } from './grupos.service';
import { PracticaService } from './practica.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  col = this.firestr.firestore.collection('Usuarios');

  constructor(private firestr: AngularFirestore, private cursoSvc: CursoService,
    private practicaSvc: PracticaService, private gruposSvc: GruposService) { }

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

  getUser(idUser: string){
    const path = this.col.doc(idUser).path
    return this.firestr.doc(path).get()
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
    try {
      const querySnapShot = this.col.where('correo', '==', correo).get();
      var materias: Diccionario<DocumentReference> = new Diccionario();
      (await querySnapShot).forEach(async (doc) => {
        if (rol === 'Docente') {
          materias = doc.data()['materias']
          for (const nombreCurso in materias) {
            this.gruposSvc.deleteGrupos(materias[nombreCurso])
            this.practicaSvc.deleteFromCursoReference(materias[nombreCurso])
            this.cursoSvc.deleteFromReference(materias[nombreCurso])
          }
        }
        this.firestr.doc(doc.ref).delete()
      })
      return true
    } catch {
      return false
    }
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
