import { Subject } from '../models/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { convertTo } from '../models/ObjectConverter';
import { SubjectTeacher } from '../models/SubjectTeacher';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {


  private col = this.firestr.firestore.collection('Materias');
  private withoutGroup: DocumentReference[] = [];
  private refSubjectSelected!: DocumentReference;

  constructor(private firestr: AngularFirestore, private activatedRoute: ActivatedRoute) { }

  getRefSubjectSelected() {
    return this.refSubjectSelected
  }

  //Methods of Group
  getWithoutGroup() {
    return this.withoutGroup;
  }
  inStudent(refEst: DocumentReference) {
    this.withoutGroup.push(refEst);
    this.refSubjectSelected.update('sinGrupo', this.withoutGroup);
  }
  outStudent(studentId: string) {
    let refEst: DocumentReference = this.withoutGroup.find(m => m.id === studentId)!;
    this.withoutGroup = this.withoutGroup.filter(e => e !== refEst);
    this.refSubjectSelected.update('sinGrupo', this.withoutGroup)
    return refEst;
  }
  async createGroup(refNewGroup: DocumentReference) {
    await this.refSubjectSelected.get().then(doc => {
      let groups: DocumentReference[] = doc.get('grupos');
      groups.push(refNewGroup);
      doc.ref.update('grupos', groups)
    })
  }
  async deleteGroup(groupId: string) {
    return this.refSubjectSelected.get().then(doc => {
      let groups: DocumentReference[] = doc.get('grupos');
      let groupToDelete: DocumentReference = groups.find(g => g.id === groupId)!
      groups = groups.filter(g => g !== groupToDelete);
      doc.ref.update('grupos', groups)
      return groupToDelete;
    })
  }
  //End Methods of Group

  getRefSubjectFromId(idSibject: string) {
    this.refSubjectSelected = this.col.doc(idSibject);
    return this.refSubjectSelected
  }

  deleteFromReference(refSubject: DocumentReference) {
    this.firestr.doc(refSubject).delete();
  }

  async getStudentsWithouGroup(subjectId: string) {
    const doc = await this.col.doc(subjectId).get();
    this.withoutGroup = doc.get('sinGrupo');
    return this.withoutGroup;
  }

  async getRefGroupsFromSubjectId(subjectId: string) {
    const doc = await this.col.doc(subjectId).get();
    let refGroups: DocumentReference[] = doc.get('grupos');
    return refGroups;
  }

  async getSubjectById(idSubject: string) {
    this.refSubjectSelected = this.col.doc(idSubject);
    let data = (await this.refSubjectSelected.get()).data();
    return convertTo(SubjectTeacher, data!);
  }

  async getNameSubjects(teacherRef: DocumentReference) {
    var listSubjects: ObjectDB<string>[] = [];
    const querySnapShot = this.col.where('docente', '==', teacherRef).get();
    (await querySnapShot).forEach((res) => {
      listSubjects.push(new ObjectDB(res.get('nombre'), res.id));
    });
    return listSubjects;
  }

  async getRefSubjectsFromRefUser(refUser: DocumentReference) {
    var refSubjects: DocumentReference[] = [];
    const querySnapShot = this.col.where('docente', '==', refUser).get();
    (await querySnapShot).forEach((doc) => {
      refSubjects.push(doc.ref);
    })
    return refSubjects;
  }
  //----------------------------------------------
  //Métodos Jorge - Módulo estudiantes

  //Obtiene la referencia de la materia mediante su ID
  async getSubjectRefById(idSubject: string) {
    let querySnapShot = await this.col.doc(idSubject).get()
    return querySnapShot
  }
  //Obtiene la materia mediante su UD
  async getSubjectById2(idSubject: string) {
    //let data = await this.col.doc(idSubject).get()
    let querySnapShot = await this.getSubjectRefById(idSubject)
    let subject = new ObjectDB(convertTo(SubjectTeacher, querySnapShot.data()!), idSubject)
    subject.getObjectDB().setDocente(querySnapShot.get('docente'))
    return subject;
  }
  //Verifica si estudiante está sin grupo
  async studentBelongToWithoutGroup(refStudent: DocumentReference, idSubject: string) {
    let querySnapShot = await this.col.doc(idSubject).get()
    let students: DocumentReference[] = querySnapShot.get('sinGrupo')
    let flag = false
    students.forEach(student => {
      if (student.isEqual(refStudent)) {
        flag = true
      }
    })
    return flag
  }

  async takeOutStudents(studentsRef: DocumentReference[], idSubject: string) {
    let querySnapShot = await this.col.doc(idSubject).get()
    let students: DocumentReference[] = querySnapShot.get('sinGrupo')
    let studentsRefIds = studentsRef.map(std => std.id)
    let newStudentsWithOutGroup = students.filter(student => {
      return !studentsRefIds.includes(student.id)
    })
    this.col.doc(idSubject).update('sinGrupo', newStudentsWithOutGroup)
  }

  async verifyCode(code: string) {
    const doc = await this.col.doc('Claves').get();
    let codes: Array<string> = doc.get('claves');
    if (codes.find(c => c === code)) {
      return false;
    }
    codes.push(code)
    this.col.doc('Claves').update({claves: codes})
    return true;
  }

  addSubject(subject: SubjectTeacher) {
    return this.col.add({
      clave: subject.getClave(),
      descripcion: subject.getDescripcion(),
      docente: subject.getDocente(),
      nombre: subject.getNombre(),
      numGrupos: subject.getNumGrupos(),
      sinGrupo: [],
      grupos: [],
      estudiantes: []
    })
  }

  updateSubject(subject: SubjectTeacher, subjectId: string) {
    return this.col.doc(subjectId).update({
      descripcion: subject.getDescripcion(),
      nombre: subject.getNombre(),
      numGrupos: subject.getNumGrupos(),
    })
  }

  async getSubjectByKey(key : string){

    let subjectsArray = await this.col.where('clave','==',key).limit(1).get();
    if(subjectsArray.size == 0) return undefined
    let subjectFound = subjectsArray.docs[0]    
    return new ObjectDB(convertTo(SubjectTeacher,subjectFound.data()),subjectFound.id)

  }

  async getSubjectsByStudentRef(studentRef : DocumentReference){
    const subjectsArray = await this.col.where('estudiantes','array-contains',studentRef).get();
    const studentSubjects = subjectsArray.docs.map(subject => {
      let aux = new ObjectDB(convertTo(SubjectTeacher,subject.data()),subject.id)
      aux.getObjectDB().setDocente(subject.get('docente'))
      return aux
    })
    return studentSubjects
  }
  
  async studentBelongToSubject(studentRef : DocumentReference , idSubject : string){
    let subject = (await this.col.doc(idSubject).get()).data()!
    let students = subject['estudiantes'] as Array<DocumentReference>
    let response = students.some(student => student.id == studentRef.id)
    return response
  }

  async registerStudent(studentRef : DocumentReference, idSubject: string){
    let subject = (await this.col.doc(idSubject).get()).data()!
    let students = subject['estudiantes'] as Array<DocumentReference>
    let withoutGroup = subject['sinGrupo'] as Array<DocumentReference>
    students.push(studentRef)
    withoutGroup.push(studentRef)
    this.col.doc(idSubject).update('estudiantes',students)
    this.col.doc(idSubject).update('sinGrupo',withoutGroup)
    let aux = new ObjectDB(convertTo(SubjectTeacher,subject),idSubject)
    aux.getObjectDB().setDocente(subject['docente'])
    return aux
  }

  async unregisterStudent(studentRef: DocumentReference, idSubject : string){
    let subject = (await this.col.doc(idSubject).get()).data()!
    let students = subject['estudiantes'] as Array<DocumentReference>
    let withoutGroup = subject['sinGrupo'] as Array<DocumentReference>
    let newStudents = students.filter(student=> student.id != studentRef.id)
    let newWithoutGroup = withoutGroup.filter(student=> student.id != studentRef.id)
    this.col.doc(idSubject).update('estudiantes',newStudents)
    this.col.doc(idSubject).update('sinGrupo',newWithoutGroup)
  }
}
