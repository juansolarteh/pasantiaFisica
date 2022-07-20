import { Timestamp } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  col = this.firestr.firestore.collection('Agenda');

  constructor(private firestr: AngularFirestore) { }

  async deleteFromPracticeReference(practiceRef: DocumentReference) {
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    (await querySnapShot).forEach((doc) => {
      this.firestr.doc(doc.ref).delete()
    })
  }

  async getBookingsByPracticeRef(practiceRef: DocumentReference) {
    var arrBookings: Timestamp[] = [];
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    (await querySnapShot).forEach((booking) => {
      arrBookings.push(booking.data()['fecha'])
    })
    return arrBookings
  }

}
