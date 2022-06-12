import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Group } from '../models/group';
import { MemberGroup } from '../models/memberGroup';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private subcollection = 'Grupos'

  constructor(private firestr: AngularFirestore) { }

  async deleteGrupos(refSubject: DocumentReference) {
    const querySnapShot = refSubject.collection(this.subcollection).get();
    (await querySnapShot).forEach((doc) => {
      this.firestr.doc(doc.ref).delete()
    })
  }

  async getFromSubjectRef(subjectRef: DocumentReference) {
    var list: any[] = []
    const querySnapShot = subjectRef.collection(this.subcollection).get();
    (await querySnapShot).forEach((doc) => {
      const group: Group = {
        id: doc.id,
        team: doc.data()
      }
      list.push(group)
    })
    return list
  }

  deleteGroupMember(member: MemberGroup, idSubject: string){

  }
}
