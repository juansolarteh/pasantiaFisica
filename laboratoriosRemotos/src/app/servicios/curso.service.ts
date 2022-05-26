import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  colGrupos = this.firestr.firestore.collection('Materias');

  constructor(private firestr: AngularFirestore) { }

  deleteFromReference(refCurso: DocumentReference){
    this.firestr.doc(refCurso).delete()
  }
}
