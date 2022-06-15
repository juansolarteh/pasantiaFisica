import { ObjectDB } from './../models/ObjectDB';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Group } from '../models/Group';
import { MemberGroup } from '../models/MemberGroup';
import { convertTo } from '../models/ObjectConverter';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private col = this.firestr.firestore.collection('Grupos');
  private groupsDB!: ObjectDB<Group>[];

  constructor(private firestr: AngularFirestore) { }

  async deleteGrupos(refSubject: DocumentReference) {
    
  }

  getGroups(){
    return this.groupsDB;
  }

  async getFromRefs(groupsRef: DocumentReference[]){
    let prom = groupsRef.map(async groupRef => {
      let group = await this.getFromRef(groupRef)
      return group
    })
    this.groupsDB = await Promise.all(prom)
    return this.groupsDB;
  }

  async getFromRef(groupRef: DocumentReference){
    const doc = await groupRef.get();
    let usersRef: DocumentReference[] = doc.get('grupo');
    let leader: DocumentReference = doc.get('lider');
    let group = new Group(usersRef, leader);
    return new ObjectDB(group, groupRef.id)
  }

  deleteGroupMember(member: MemberGroup, idSubject: string){

  }

  getGroupsFromRefStudent(studentRef: DocumentReference){
    let idGroups : String[] = []
    let query = this.col.where('grupo','array-contains',studentRef).get()
    query.then(res=>{
      if(res.size >0){
        res.forEach(doc=>{
          idGroups.push(doc.id)
        })
      }
    })
    return idGroups
  }
}
