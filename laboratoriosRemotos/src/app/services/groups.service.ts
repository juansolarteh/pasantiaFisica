import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Group } from '../models/Group';
import { MemberGroup } from '../models/memberGroup';
import { convertTo } from '../models/ObjectConverter';
import { ObjectDB } from '../models/ObjectDB';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private col = this.firestr.firestore.collection('Grupos');

  constructor(private firestr: AngularFirestore) { }

  async deleteGrupos(refSubject: DocumentReference) {
    
  }

  async getFromSubjectRef(subjectRef: DocumentReference) {
    var groups: ObjectDB<Group>[] = []
    const querySnapShot = this.col.where('materia', '==', subjectRef).get();
    (await querySnapShot).forEach(res => {
      let group: Group = convertTo(Group, res.data());
      groups.push(new ObjectDB(group, res.id));
    })
    return groups
  }

  deleteGroupMember(member: MemberGroup, idSubject: string){

  }
}
