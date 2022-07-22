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

  //Obtiene las materias donde el estudiante está sin grupo
  async getSubjectsWithoutGroup(studentRef: DocumentReference) {
    var listWithoutGroup: ObjectDB<SubjectTeacher>[] = [];
    const querySnapShot = this.col.where('sinGrupo', 'array-contains', studentRef).get();
    (await querySnapShot).forEach(doc => {
      let subject = new ObjectDB(convertTo(SubjectTeacher, doc.data()), doc.id)
      subject.getObjectDB().setDocente(doc.get('docente'))
      listWithoutGroup.push(subject)
    })
    return listWithoutGroup
  }

  //Obtiene las materias donde el estudiante pertenece a un grupo
  async getSubjectsByGroup(data: string[]) {
    var listWithGroup: ObjectDB<SubjectTeacher>[] = [];
    if (data != null) {
      let querySnapShot = this.col.get();
      (await querySnapShot).forEach(doc => {
        if (doc.id != 'Claves') {
          let groupsSubject = doc.get('grupos') as Array<DocumentReference>
          groupsSubject.forEach(group => {
            if ((data.includes(group.id))) {
              let subject = new ObjectDB(convertTo(SubjectTeacher, doc.data()), doc.id)
              subject.getObjectDB().setDocente(doc.get('docente'))
              listWithGroup.push(subject)
            }
          })
        }
      })
    }
    return listWithGroup
  }
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
    console.log("Desde servicio: ", refStudent, idSubject)
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
    console.log("Sin grupo Materia", newStudentsWithOutGroup)
    this.col.doc(idSubject).update('sinGrupo', newStudentsWithOutGroup)
    //this.refSubjectSelected.update('sinGrupo', this.withoutGroup)
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
      grupos: []
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
    let querySnapShot = this.col.where('clave','==',key).get();
    let subject = (await querySnapShot).docs[0]
    if(subject){
      let data = subject.data()
      return new ObjectDB(convertTo(SubjectTeacher,data),subject.id)
    }
   return
  }
}
