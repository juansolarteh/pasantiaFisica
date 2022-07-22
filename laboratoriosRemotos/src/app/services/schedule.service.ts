import { Timestamp } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/compat/firestore';
import * as moment from 'moment';

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

  async deleteFromPracticeReferenceChangeStart(practiceRef: DocumentReference, start: Date) {
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    (await querySnapShot).docs.forEach(doc => {
      let ts: Timestamp = doc.get('fecha')
      let date = new Date(ts.seconds * 1000);
      if(moment(date).isBefore(start)){
        doc.ref.delete()
      }
    })
  }

  async deleteFromPracticeReferenceChangeEnd(practiceRef: DocumentReference, end: Date) {
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    (await querySnapShot).docs.forEach(doc => {
      let ts: Timestamp = doc.get('fecha')
      let date = new Date(ts.seconds * 1000);
      if(moment(date).isAfter(end)){
        doc.ref.delete()
      }
    })
  }

  async deleteFromGroupRef(groupRef: DocumentReference){
    const querySnapShot = this.col.where('grupo', '==', groupRef).get();
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
