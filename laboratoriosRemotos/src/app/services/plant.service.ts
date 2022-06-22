import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { convertTo } from '../models/ObjectConverter';
import { ObjectDB } from '../models/ObjectDB';
import { Plant } from '../models/Plant';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  private col = this.firestr.firestore.collection('Plantas');
  private sub = 'Constantes';
  private withoutGroup: DocumentReference[] = [];

  constructor(private firestr: AngularFirestore) { }

  async getNamePlantsDB(): Promise<ObjectDB<Plant>[]>{
    const snap = await this.col.get();
    let docs = snap.docs;
    return docs.map(doc => {
      return new ObjectDB<Plant>(convertTo(Plant, doc.data()), doc.id);
    });
  }

  async getConstantsDB(idPlant: string): Promise<ObjectDB<number[]>[]>{
    const snap = await this.col.doc(idPlant).collection(this.sub).get();
    let docs = snap.docs;
    return docs.map(doc => {
      let data = doc.data();
      let values: number[] = Object.values(data)
      return new ObjectDB<number[]>(values, doc.id);
    });
  }

  getPlantRefFromId(idPlant: string){
    return this.col.doc(idPlant)
  }
}
