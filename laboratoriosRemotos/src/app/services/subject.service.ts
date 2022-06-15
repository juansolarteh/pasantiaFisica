import { GroupsService } from 'src/app/services/groups.service';
import { Subject } from '../models/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { convertTo } from '../models/ObjectConverter';
import { SubjectUltimo } from '../models/SubjectUltimo';
import { Group } from '../models/Group';



@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private col = this.firestr.firestore.collection('Materias');

  subjects: Subject[] = [];


  constructor(private firestr: AngularFirestore, private groupService: GroupsService) { }

  deleteFromReference(refSubject: DocumentReference) {
    this.firestr.doc(refSubject).delete();
  }

  async getStudentsWithouGroup(subjectId: string) {
    const doc = await this.col.doc(subjectId).get();
    let withoutGroups: DocumentReference[] = doc.get('sinGrupo');
    return withoutGroups;
  }

  async getRefGroupsFromSubjectId(subjectId: string) {
    const doc = await this.col.doc(subjectId).get();
    let refGroups: DocumentReference[] = doc.get('grupos');
    return refGroups;
  }

  async getSubjectById(idSubject: string) {
    let data = (await this.col.doc(idSubject).get()).data();
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
  async getSubjectsFromStudent(studentRef: DocumentReference) {
    var listSubjects: ObjectDB<Subject>[] = [];
    var listWithoutGroup : ObjectDB<Subject>[] = [];
    var listWithGroup : ObjectDB<Subject>[] = [];
    listWithoutGroup = await this.getSubjectsWithoutGroup(studentRef)
    listWithGroup = await this.getSubjectsByGroup(studentRef)
    listSubjects = listWithGroup.concat(listWithoutGroup)
    return listSubjects;
  }
  private async getSubjectsWithoutGroup(studentRef: DocumentReference){
    var listWithoutGroup : ObjectDB<Subject>[] = [];
    const querySnapShot = this.col.where('sinGrupo', 'array-contains', studentRef).get();
    (await querySnapShot).forEach(doc=>{
      let subject = new ObjectDB(convertTo(Subject, doc.data()), doc.id)
      listWithoutGroup.push(subject)
    })
    return listWithoutGroup
  }

  private async getSubjectsByGroup(studentRef: DocumentReference) {
    var listWithGroup : ObjectDB<Subject>[] = [];
    let data = this.groupService.getGroupsFromRefStudent(studentRef)
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
