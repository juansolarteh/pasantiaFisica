import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { deleteDoc } from '@firebase/firestore';
import { AgendaService } from './agenda.service';

@Injectable({
  providedIn: 'root'
})
export class PracticaService {

  col = this.firestr.firestore.collection('Practicas');

  constructor(private firestr: AngularFirestore, private agendaSvc: AgendaService) { }

  async deleteFromCursoReference(refCurso: DocumentReference){
    const querySnapShot = this.col.where('materia', '==', refCurso).get();
    var refCurso: DocumentReference
    (await querySnapShot).forEach((doc) => {
      refCurso = doc.ref
      deleteDoc(doc.ref)
    })
    await this.agendaSvc.deleteFromPracticaReference(refCurso)
  }
}
