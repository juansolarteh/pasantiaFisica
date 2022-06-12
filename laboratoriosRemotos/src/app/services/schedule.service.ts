import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  col = this.firestr.firestore.collection('Agenda');

  constructor(private firestr: AngularFirestore) { }

  async deleteFromPracticaReference(practiceRef: DocumentReference){
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    (await querySnapShot).forEach((doc) => {
      this.firestr.doc(doc.ref).delete()
    })
  }
}
