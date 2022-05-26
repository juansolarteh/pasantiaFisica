import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  nameColletion = 'Grupos'

  constructor(private firestr: AngularFirestore) { }

  async deleteGrupos(refCurso: DocumentReference){
    const a = refCurso.collection(this.nameColletion).get();
    (await a).forEach((doc) => {
      this.firestr.doc(doc.ref).delete()
    })
  }
}
