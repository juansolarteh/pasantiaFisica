import { Subject } from './../modelos/Subject';
import { plainToInstance } from 'class-transformer';
import { Practice } from 'src/app/modelos/Practice';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PracticaService {

  col = this.firestr.firestore.collection('Practicas');
  subcollection = 'Constantes'

  constructor(private firestr: AngularFirestore) { }

  async deleteFromSubjectReference(subjectRef: DocumentReference){
    const querySnapShot = this.col.where('materia', '==', subjectRef).get();
    (await querySnapShot).forEach(async (doc) => {
      const constants = doc.ref.collection(this.subcollection).get();
      (await constants).forEach(doc => {
        this.firestr.doc(doc.ref).delete()
      })
      this.firestr.doc(doc.ref).delete()
    })
  }

  async getPracticesRef(refSubject: DocumentReference){
    var practicesRef: DocumentReference[] = [] 
    const querySnapShot = this.col.where('materia', '==', refSubject).get();
    (await querySnapShot).forEach((doc) => {
      practicesRef.push(doc.ref)
    })
    return practicesRef
  }


  async getPractices(refSubject: DocumentReference){
    let practices : Practice[] = []
    this.getPracticesRef(refSubject).then(res=>{
      res.forEach(practice =>{
        this.col.doc(practice.id).get().then(res=>{
          //Se convierte la respuesta a string y luego a JSON para poder castear la data a tipo Practice
          //Esto se realiza mediante el metodo plainToInstance de la libreria externa "class-transformer"
          let dataString = JSON.stringify(res.data())
          let data = JSON.parse(dataString) as Object
          let newPractice = plainToInstance(Practice, data)
          practices.push(newPractice)
        })
      })
    })
    return practices
  }
}
