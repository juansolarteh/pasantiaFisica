import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Diccionario } from '../modelos/diccionario';
import { Group } from '../modelos/group';
import { MemberGroup } from '../modelos/memberGroup';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private subcollection = 'Grupos'
  private col = this.firestr.firestore.collection('Materias');

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

  async moveMemberGroup(member: MemberGroup, idPreviousGroup: string, idNewGroup: string, idSubject: string) {
    var docRef: DocumentReference = this.col.doc(idSubject).collection(this.subcollection).doc(idPreviousGroup);
    var docDat = (await docRef.get()).data();
    if (docDat) {
      console.log(docDat)
      var group = docDat['grupo']
      
      const result = Object.values(group).filter(value => {
        console.log(value);
        return value !== member.id;
      });
      console.log(result)
    }
  }


  deleteGroupMember(member: MemberGroup, idSubject: string) {

  }
}
