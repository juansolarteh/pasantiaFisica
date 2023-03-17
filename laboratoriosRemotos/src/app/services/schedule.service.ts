import { Booking } from 'src/app/models/Booking';
import { Timestamp } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { DynamicBooking } from '../models/subjectSchedule';

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

  async getBookingsByPlantRef(plantRef: DocumentReference) {
    let arrBookings: Timestamp[] = [];
    const querySnapShot = this.col.where('planta', '==', plantRef).where('realizada', '==', false).get();
    (await querySnapShot).forEach((booking) => {
      arrBookings.push(booking.data()['fecha'])
    })
    return arrBookings
  }

  async getBookingsAndPracticeBySubjectRef(subjectRef: DocumentReference) {
    let booking: DynamicBooking[] = [];
    const querySnapShot = this.col.where('materia', '==', subjectRef).get();
    (await querySnapShot).forEach((doc) => {
      let sched: DynamicBooking = {
        date: doc.get('fecha'),
        practice: doc.get('practica'),
        groupId: doc.get('grupo').id,
        plantId: doc.get('planta').id
      }
      booking.push(sched)
    })
    return booking
  }

  async createBooking(newBooking : Booking){
    let aux = await this.col.add({
      fecha: newBooking.fecha,
      practica: newBooking.practica,
      grupo: newBooking.grupo,
      materia: newBooking.materia,
      planta: newBooking.planta,
      realizada: newBooking.realizada
    })
    let newB : Booking = (await aux.get()).data()!
    newB.id = aux.id
    return newB
  }
  async getBookingsStudentByPlantRef(plantRef: DocumentReference) {
    let arrBookings: Booking[] = [];
    const querySnapShot = this.col.where('planta', '==', plantRef).where('realizada', '==', false).get();
    (await querySnapShot).forEach((booking) => {
      let aux = booking.data()
      aux['id']=booking.id
      arrBookings.push(aux)
    })
    return arrBookings
  }

  async getBooking(subjectRef : DocumentReference, practiceRef : DocumentReference, groupRef : DocumentReference){
    const querySnapShot = this.col.where('materia', '==', subjectRef).where('practica', '==', practiceRef).where('grupo','==',groupRef).get() 
    if((await querySnapShot).size > 0){
      let data = (await querySnapShot).docs[0]
      const {fecha, grupo, materia, planta, practica, realizada } = data.data()
      let booking : Booking = {
        id : data.id,
        fecha: fecha,
        grupo: grupo,
        materia: materia,
        planta: planta,
        practica: practica,
        realizada: realizada
      }
      return booking
    }
    return undefined
    //return (await querySnapShot).size > 0 ? (await querySnapShot).docs[0].data() : undefined 
  }

  /* async isGroupBooked(refGroup : DocumentReference, refPractice : DocumentReference){
    let querySnapshot = await this.col.where('practica','==', refPractice).where('grupo','==',refGroup).get();
    if(querySnapshot.size > 0){
      return true
    }
    return false
  } */
  updateBooking(idBooking : string, newDate: Timestamp){
    this.col.doc(idBooking).update('fecha',newDate)
  }

  practiceFinished(idBooking : string){
    console.log(idBooking)
    this.col.doc(idBooking).update('realizada',true)
  }

}
