import { convertTo } from 'src/app/models/ObjectConverter';
import { ObjectDB } from './../models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { PracticeNameDate } from '../models/Practice';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  
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
    const querySnapShot = this.col.where("materia", "==", refSubject).get();
    (await querySnapShot).forEach(doc => {
      let newPractice = new ObjectDB(convertTo(Practice, doc.data()), doc.id)
      practices.push(newPractice)
    })
    return practices
  }

  async getPracticesFromSubjectRef(subjectRef: DocumentReference) {
    let query = this.col.where('materia', '==', subjectRef)
    const qSnapShot = await query.get();
    return qSnapShot.docs.map(res => {
      let practice: Practice = convertTo(Practice, res.data());
      return new ObjectDB(practice, res.id);
    });
  }

  async getPracticesNameDate(subjectRef: DocumentReference): Promise<ObjectDB<PracticeNameDate>[]> {
    let query = this.col.where('materia', '==', subjectRef)
    const qSnapShot = await query.get();
    return qSnapShot.docs.map(res => {
      let practice: PracticeNameDate = new PracticeNameDate(res.get('nombre'), res.get('fecha_creacion'));
      return new ObjectDB(practice, res.id);
    });
  }

  addPractice(practice: Practice) {
    return this.col.add({
      nombre: practice.getNombre(),
      fecha_creacion: practice.getFecha_creacion(),
      inicio: practice.getInicio(),
      fin: practice.getFin(),
      planta: practice.getPlanta(),
      materia: practice.getMateria(),
      descripcion: practice.getDescripcion(),
    });
  }

  addPathDocs(pathDocs: string[], idPractice: string) {
    return this.col.doc(idPractice).update('documentos', pathDocs)
  }

  addConstants(constants: ObjectDB<any>[], practiceRef: DocumentReference){
    constants.forEach(cons => {
      practiceRef.collection(this.subcollection).doc(cons.getId()).set(cons.getObjectDB())
    })
  }
}
