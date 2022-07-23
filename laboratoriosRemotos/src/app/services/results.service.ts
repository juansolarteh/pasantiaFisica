import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { Results } from '../models/Results';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  col = this.firestr.firestore.collection('Resultados');

  constructor(private firestr: AngularFirestore) { }

  async getFilesByPracticeRef(practiceRef: DocumentReference) {
    const querySnapShot = this.col.where('practica', '==', practiceRef).get();
    let results: ObjectDB<Results>[] = [];
    let result: Results;
    (await querySnapShot).forEach((doc) => {
      let ref: DocumentReference = doc.get('grupo')
      result = new Results(doc.get('eventos'), doc.get('resultados'))
      results.push(new ObjectDB(result, ref.id))
    });
    return results
  }

}
