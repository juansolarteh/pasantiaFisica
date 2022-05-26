import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  colGrupos = this.firestr.firestore.collection('Materias');

  constructor(private firestr: AngularFirestore) { }

  async deleteFromReference(refCurso: DocumentReference){
    deleteDoc(refCurso)
  }
}
