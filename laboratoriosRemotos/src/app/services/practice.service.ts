import { convertTo } from 'src/app/models/ObjectConverter';
import { ObjectDB } from './../models/ObjectDB';
import { plainToInstance } from 'class-transformer';
import { Practice } from 'src/app/models/Practice';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  private objPracticeSelected!: ObjectDB<Practice>
  col = this.firestr.firestore.collection('Practicas');
  subcollection = 'Constantes'

  constructor(private firestr: AngularFirestore) { }

  async deleteFromSubjectReference(subjectRef: DocumentReference) {
    const querySnapShot = this.col.where('materia', '==', subjectRef).get();
    (await querySnapShot).forEach(async (doc) => {
      const constants = doc.ref.collection(this.subcollection).get();
      (await constants).forEach(doc => {
        this.firestr.doc(doc.ref).delete()
      })
      this.firestr.doc(doc.ref).delete()
    })
  }

  async delete(practiceRef: DocumentReference) {
    this.firestr.doc(practiceRef).delete();
  }

  async getPracticesRefFromSubjectRef(refSubject: DocumentReference) {
    var practicesRef: DocumentReference[] = []
    const querySnapShot = this.col.where('materia', '==', refSubject).get();
    (await querySnapShot).forEach((doc) => {
      practicesRef.push(doc.ref)
    })
    return practicesRef
  }

  //Metodos Jorge Solano - Modulo de estudiante
  async getPracticesBySubject(refSubject: DocumentReference) {
    var practices: ObjectDB<Practice>[] = []
    const querySnapShot = this.col.where("materia","==",refSubject).get();
    (await querySnapShot).forEach(doc=>{
      let newPractice = new ObjectDB(convertTo(Practice,doc.data()),doc.id)
      practices.push(newPractice)
    })
    return practices
  }
  setPracticeSelected(objPracticeSelected: ObjectDB<Practice>){
    this.objPracticeSelected = objPracticeSelected
  }
  getPracticeSelected(){
    return this.objPracticeSelected
  }
  
}
