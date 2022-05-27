import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  subcollection = 'Grupos'

  constructor(private firestr: AngularFirestore) { }

  async deleteGrupos(refSubject: DocumentReference){
    const querySnapShot = refSubject.collection(this.subcollection).get();
    (await querySnapShot).forEach((doc) => {
      this.firestr.doc(doc.ref).delete()
    })
  }
}
