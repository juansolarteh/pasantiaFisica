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
    let subColEmpty = (await practiceRef.collection(this.subcollection).get()).empty
    if (!subColEmpty){
      (await practiceRef.collection(this.subcollection).get()).docs.forEach(snap => {
        snap.ref.delete()
      })
    }
    this.firestr.doc(practiceRef).delete();
  }

  async getRefByPracticeId(practiceId: string){
    const snaps = await this.col.doc(practiceId).get();
    return snaps.ref
  }
  
  async getDocumentsByPracticeRef(practiceRef: DocumentReference){
    const snaps = await practiceRef.get();
    let documents: string[] = snaps.get('documentos');
    return documents
  }

  async getPracticesRefFromSubjectRef(refSubject: DocumentReference) {
    let practicesRef: DocumentReference[] = []
    const querySnapShot = this.col.where('materia', '==', refSubject).get();
    (await querySnapShot).forEach((doc) => {
      practicesRef.push(doc.ref)
    })
    return practicesRef
  }

  //Metodos Jorge Solano - Modulo de estudiante
  async getPracticesBySubject(refSubject: DocumentReference) {
    let practices: ObjectDB<Practice>[] = []
    const querySnapShot = this.col.where("materia", "==", refSubject).get();
    (await querySnapShot).forEach(doc => {
      let newPractice = new ObjectDB(convertTo(Practice, doc.data()), doc.id)
      practices.push(newPractice)
    })
    return practices
  }

  async getPracticeById(idPractice: string): Promise<ObjectDB<Practice>>{
    let data = await this.col.doc(idPractice).get()
    let practice = new ObjectDB(convertTo(Practice, data.data()!),idPractice)
    practice.getObjectDB().setPlanta(data.get('planta'))
    return practice;
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
    let practices = qSnapShot.docs.map(res => {
      let practice: PracticeNameDate = new PracticeNameDate(res.get('nombre'), res.get('fecha_creacion'));
      return new ObjectDB(practice, res.id);
    });
    return this.orderPracticesByDate(practices);
  }

  private orderPracticesByDate(practices: ObjectDB<PracticeNameDate>[]){
    practices.sort((a, b) => {
      if(a.getObjectDB().getFecha_creacion() < b.getObjectDB().getFecha_creacion()){
        return 1
      }
      return (a.getObjectDB().getFecha_creacion() > b.getObjectDB().getFecha_creacion())? -1: 0;
    })
    return practices
  }

  async getRefSubjectById(idPractice: string): Promise<DocumentReference>{
    let data = await this.col.doc(idPractice).get()
    return data.get('materia')
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

  updatePractice(practice: Practice, idPractice: string) {
    return this.col.doc(idPractice).update({
      nombre: practice.getNombre(),
      inicio: practice.getInicio(),
      fin: practice.getFin(),
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

  addConstantsById(constants: ObjectDB<any>[], practiceId: string){
    constants.forEach(cons => {
      this.col.doc(practiceId).collection(this.subcollection).doc(cons.getId()).set(cons.getObjectDB())
    })
  }

  async getPracticeName(refPractice: DocumentReference): Promise<string>{
    let doc = await refPractice.get();
    return doc.get('nombre')
  }

  async getConstantsPractice(idPractice: string){
    const snap = await this.col.doc(idPractice).collection(this.subcollection).get();
    let docs = snap.docs;
    return docs.map(doc => {
      let data = doc.data();
      let values: number[] = Object.values(data)
      return new ObjectDB<number[]>(values, doc.id);
    });
  }
}