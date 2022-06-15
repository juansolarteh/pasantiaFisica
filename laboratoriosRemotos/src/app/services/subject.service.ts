import { GroupsService } from 'src/app/services/groups.service';
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

  private col = this.firestr.firestore.collection('Materias');

  private withoutGroup: DocumentReference[] = [];
  private refSubjectSelected!: DocumentReference;

  constructor(private firestr: AngularFirestore) { }

  //Methods of Group
  getWithoutGroup(){
    return this.withoutGroup
  }
  inStudent(refEst: DocumentReference){
    this.withoutGroup.push(refEst);
    this.refSubjectSelected.update('sinGrupo', this.withoutGroup);
  }
  outStudent(studentId: string){
    let refEst: DocumentReference = this.withoutGroup.find(m => m.id === studentId)!;
    this.withoutGroup = this.withoutGroup.filter(e => e !== refEst);
    this.refSubjectSelected.update('sinGrupo', this.withoutGroup)
    return refEst;
  }
  createGroup(refNewGroup: DocumentReference){
    this.refSubjectSelected.get().then(doc => {
      let groups: DocumentReference[] = doc.get('grupos');
      groups.push(refNewGroup);
      doc.ref.update('grupos', groups)
    })
  }
  async deleteGroup(groupId: string){
    return this.refSubjectSelected.get().then(doc => {
      let groups: DocumentReference[] = doc.get('grupos');
      let groupToDelete: DocumentReference = groups.find(g => g.id === groupId)!
      groups = groups.filter(g => g !== groupToDelete);
      doc.ref.update('grupos', groups)
      return groupToDelete;
    })
  }
  //End Methods of Group

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
    return convertTo(SubjectUltimo, data!);
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
  async getSubjectsWithoutGroup(studentRef: DocumentReference){
    var listWithoutGroup : ObjectDB<Subject>[] = [];
    const querySnapShot = this.col.where('sinGrupo', 'array-contains', studentRef).get();
    (await querySnapShot).forEach(doc=>{
      let subject = new ObjectDB(convertTo(Subject, doc.data()), doc.id)
      listWithoutGroup.push(subject)
    })
    return listWithoutGroup
  }

  async getSubjectsByGroup(data: string[]) {
    var listWithGroup : ObjectDB<Subject>[] = [];
    if (data != null) {
      let querySnapShot = this.col.get();
      (await querySnapShot).forEach(doc=>{
        let groupsSubject = doc.get('grupos') as Array<DocumentReference>
        groupsSubject.forEach(group => {
          if ((data.includes(group.id))) {
            let subject = new ObjectDB(convertTo(Subject, doc.data()), doc.id)
            listWithGroup.push(subject)
          }
        })
      })
    }
    return listWithGroup
  }
}
