import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, collection } from '@angular/fire/firestore';
import { DocumentData, getDocs, query, where } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async defineRol(email: string){
    const col = collection(getFirestore(), 'Usuarios')
    const q = query(col, where("correo", "==", email))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const user: DocumentData = doc.data()
      localStorage.setItem('rol', user['rol'])
    });
  }
}
