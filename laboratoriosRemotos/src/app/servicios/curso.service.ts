import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  colGrupos = this.firestr.firestore.collection('Materias');
  nameSubCollection = 'Grupos'

  constructor(private firestr: AngularFirestore) { }

  async deleteFromReference(refCurso: DocumentReference){
    const a = refCurso.collection(this.nameSubCollection).get();
    (await a).forEach((doc) => {
      console.log(doc.data())
    })
    //deleteDoc(refCurso)
  }
}
