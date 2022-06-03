import { Subject } from './../modelos/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  col = this.firestr.firestore.collection('Materias');
  subjects: Subject[] = [];
  constructor(private firestr: AngularFirestore) { }

  deleteFromReference(refCurso: DocumentReference) {
    this.firestr.doc(refCurso).delete()
  }


  async getSubjectsFromStudent(refStudent: DocumentData) {
    //Obtencion de referencias de materias
    const mapMaterias = refStudent["materias"]
    const refMaterias: any[] = [];
    //Almacenamos las referencias en un ArrayDeReferencias
    for (const key in mapMaterias) {
      refMaterias.push(mapMaterias[key])
    }
    //Recorremos Las referencias y creamos nuevas materias en una lista
    refMaterias.forEach(element => {
      this.col.doc(element.id).get().then(res => {
        let data = res.data()
        if (data != undefined) {
          let subject_info = {
            clave: data['clave'],
            descripcion: data['descripcion'],
            nombre: data['nombre'],
            numGrupos: data['numGrupos'],
            docente: data['docente']
          }
          let subject = new Subject(element.id, subject_info)
          this.subjects.push(subject)
        }
      })
    })
    return this.subjects
  }

  getSubject(idSubject: string) {
    return this.col.doc(idSubject)
  }

}
