import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { MemberGroup } from '../modelos/memberGroup';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

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
      list.push(doc.data())
    })
    return list
  }

  deleteGroupMember(member: MemberGroup, idSubject: string){

  }
}
