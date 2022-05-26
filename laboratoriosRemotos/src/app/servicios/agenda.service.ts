import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  col = this.firestr.firestore.collection('Agenda');

  constructor(private firestr: AngularFirestore) { }

  async deleteFromPracticaReference(refPractica: DocumentReference){
    const querySnapShot = this.col.where('practica', '==', refPractica).get();
    (await querySnapShot).forEach((doc) => {
      deleteDoc(doc.ref)
    })
  }
}
