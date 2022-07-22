import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Group } from '../models/Group';
import { MemberGroup } from '../models/MemberGroup';
import { ObjectDB } from '../models/ObjectDB';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private col = this.firestr.firestore.collection('Grupos');
  private groupsDB!: ObjectDB<Group>[];

  constructor(private firestr: AngularFirestore) { }

  //Mehtods from teacher
  deleteGroup(refGroup: DocumentReference) {
    if (this.groupsDB) {
      this.groupsDB = this.groupsDB.filter(g => g.getId() !== refGroup.id);
    }
    refGroup.delete()
  }
  outGroup(groupId: string, studentId: string) {
    let indexGroup: number = this.groupsDB.findIndex(g => g.getId() === groupId);
    let refEst: DocumentReference = this.groupsDB[indexGroup].getObjectDB().getGrupo().find(m => m.id === studentId)!;
    let newGroup: DocumentReference[] = this.groupsDB[indexGroup].getObjectDB().getGrupo().filter(m => m !== refEst)
    this.groupsDB[indexGroup].getObjectDB().setGrupo(newGroup);
    this.col.doc(groupId).update('grupo', newGroup);
    return refEst;
  }
  async inGroup(groupId: string, studentRef: DocumentReference) {
    if (groupId !== 'NG') {
      let indexGroup: number = this.groupsDB.findIndex(g => g.getId() === groupId);
      this.groupsDB[indexGroup].getObjectDB().getGrupo().push(studentRef);
      this.col.doc(groupId).update('grupo', this.groupsDB[indexGroup].getObjectDB().getGrupo())
      return undefined;
    } else {
      let newGroup = new Group([studentRef], studentRef);
      let refNewGroup: DocumentReference = await this.createGroup(newGroup);
      this.groupsDB.push(new ObjectDB(newGroup, refNewGroup.id))
      return refNewGroup
    }
  }
  async transferGroup(newGroupId: string, prevGroupId: string, studentId: string) {
    let indexPrevGroup: number = this.groupsDB.findIndex(g => g.getId() === prevGroupId);
    let refEst: DocumentReference = this.groupsDB[indexPrevGroup].getObjectDB().getGrupo().find(m => m.id === studentId)!;
    let prevGroup: DocumentReference[] = this.groupsDB[indexPrevGroup].getObjectDB().getGrupo().filter(m => m !== refEst);
    this.groupsDB[indexPrevGroup].getObjectDB().setGrupo(prevGroup);
    this.col.doc(prevGroupId).update('grupo', prevGroup);
    if (newGroupId !== 'NG') {
      let indexNewGroup: number = this.groupsDB.findIndex(g => g.getId() === newGroupId);
      this.groupsDB[indexNewGroup].getObjectDB().getGrupo().push(refEst);
      this.col.doc(newGroupId).update('grupo', this.groupsDB[indexNewGroup].getObjectDB().getGrupo());
      return undefined;
    } else {
      let newGroup = new Group([refEst], refEst)
      let refNewGroup: DocumentReference = await this.createGroup(newGroup);
      this.groupsDB.push(new ObjectDB(newGroup, refNewGroup.id));
      return refNewGroup;
    }
  }
  convertLeader(idStudent: string, groupId: string) {
    let indexGroup: number = this.groupsDB.findIndex(g => g.getId() === groupId);
    let refEst: DocumentReference = this.groupsDB[indexGroup].getObjectDB().getGrupo().find(m => m.id === idStudent)!;
    this.groupsDB[indexGroup].getObjectDB().setLider(refEst);
    this.col.doc(groupId).update('lider', refEst);
  }
  //End Mehtods from teacher

  async createGroup(newGroup: Group) {
    let refNewGroup: DocumentReference = await this.col.add({
      grupo: newGroup.getGrupo(),
      lider: newGroup.getLider()
    }).then(doc => {
      return doc;
    });
    return refNewGroup;
  }

  async getFromRefs(groupsRef: DocumentReference[]) {
    let prom = groupsRef.map(async groupRef => {
      let group = await this.getFromRef(groupRef)
      return group
    })
    this.groupsDB = await Promise.all(prom)
    return this.groupsDB;
  }

  async getFromRef(groupRef: DocumentReference) {
    const doc = await groupRef.get();
    let usersRef: DocumentReference[] = doc.get('grupo');
    let leader: DocumentReference = doc.get('lider');
    let group = new Group(usersRef, leader);
    return new ObjectDB(group, groupRef.id)
  }

  async getGroupsByRefStudent(studentRef: DocumentReference) {
    let idGroups: string[] = []
    let querySnapShot = this.col.where('grupo', 'array-contains', studentRef).get();
    (await querySnapShot).forEach(doc => {
      idGroups.push(doc.id)
    })
    return idGroups
  }
  async getGroupRefById(groupId : string){
    let querySnapShot = await this.col.doc(groupId).get()
    return querySnapShot.ref
  }
}
