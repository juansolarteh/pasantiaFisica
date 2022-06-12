import { Subject } from '../models/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { convertTo } from '../models/ObjectConverter';
import { SubjectUltimo } from '../models/SubjectUltimo';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  //refSubject.collection(this.subCol).doc('SG')
  private col = this.firestr.firestore.collection('Materias');
  private subCol = 'Grupos'
  
  subjects: Subject[] = [];
  private refSubjectSelected !: DocumentReference;

  constructor(private firestr: AngularFirestore) { }

  deleteFromReference(refSubject: DocumentReference) {
    this.firestr.doc(refSubject).delete();
  }

  getRefSubjectSelected(){
    return this.refSubjectSelected;
  }

  getSubjectById(idSubject: string) {
    this.refSubjectSelected = this.col.doc(idSubject);
    let subjectDB!: ObjectDB<SubjectUltimo>;
    this.refSubjectSelected.get().then(res => {
      let subject: SubjectUltimo = convertTo(SubjectUltimo, res.data()!);
      subjectDB = new ObjectDB(subject, res.id);
    });
    return subjectDB;
  }

  async getNameSubjects(teacherRef: DocumentReference){
    var listSubjects: ObjectDB<string>[] = [];
    const querySnapShot = this.col.where('docente', '==', teacherRef).get();
    (await querySnapShot).forEach((res) => {
      listSubjects.push(new ObjectDB(res.get('nombre'), res.id));
    });
    return listSubjects;
  }

  async prueba(studentRef: DocumentReference){
    var listSubjects: DocumentReference[] = [];
    (await this.firestr.firestore.collection('Grupos').where('grupo', 'array-contains', studentRef).get()).forEach(r =>{
      let refSubject: DocumentReference = r.get('Materia');
    })
  }

  getSubjectsByRefs(refSubject: DocumentReference[]){
    refSubject.forEach(t => {
      
    })
  }

  getSubjectByRef(refSubject: DocumentReference){
    let a!:ObjectDB<SubjectUltimo>;
    refSubject.get().then(s => {
      let sub = convertTo(SubjectUltimo, s.data()!)
      a = new ObjectDB(sub, s.id)
    })
    return a;
  }

  async getSubjectsFromStudent(refStudent: DocumentData) {
    //Obtencion de referencias de materias
    const mapMaterias = refStudent["materias"]
    const refMaterias: any[] = [];
    //Almacenamos las referencias en un ArrayDeReferencias
    for (const key in mapMaterias) {
      refMaterias.push(mapMaterias[key])
    }
    //Recorremos Las referencias y creamos nuevas materias en una lista
    refMaterias.forEach(element => {
      this.col.doc(element.id).get().then(res => {
        let data = res.data()
        if (data != undefined) {
          let subject_info = {
            clave: data['clave'],
            descripcion: data['descripcion'],
            nombre: data['nombre'],
            numGrupos: data['numGrupos'],
            docente: data['docente']
          }
          let subject = new Subject(element.id, subject_info)
          this.subjects.push(subject)
        }
      })
    })
    return this.subjects
  }

  async getRefSubjectsFromRefUser(refUser: DocumentReference){
    var refSubjects: DocumentReference[] = [];
    const querySnapShot = this.col.where('docente', '==', refUser).get();
    (await querySnapShot).forEach((doc) => {
      refSubjects.push(doc.ref);
    })
    return refSubjects;
  }

}
