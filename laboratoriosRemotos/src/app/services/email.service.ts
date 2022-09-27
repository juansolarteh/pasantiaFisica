import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { Results } from '../models/Results';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  API = ""

  constructor(private firestr: AngularFirestore) { }

  sendEmail(){
    
  }
}
