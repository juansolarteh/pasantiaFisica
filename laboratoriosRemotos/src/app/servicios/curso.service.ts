import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  col = this.firestr.firestore.collection('Materias');
  materias: any[] = [];

  constructor(private firestr: AngularFirestore) { }

  deleteFromReference(refCurso: DocumentReference){
    this.firestr.doc(refCurso).delete()
  }


  async getSubjectsFromStudent(refStudent : DocumentData) {
    const mapMaterias = refStudent["materias"]
    const refMaterias: any[] = [];
    
    for (const key in mapMaterias) {
      refMaterias.push(mapMaterias[key])
    }
    refMaterias.forEach(element=>{
      this.col.doc(element.id).get().then(res=>{
        this.materias.push(res.data())
      })
    })
    return this.materias
  }

  getSubject(idSubject: string){
    return this.col.doc(idSubject)
  }

}
