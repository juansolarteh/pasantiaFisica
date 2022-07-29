import { Timestamp } from '@firebase/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';

export interface Booking{
    id?:string,
    fecha?: Timestamp,
    grupo?: DocumentReference,
    practica?: DocumentReference,
    materia?: DocumentReference,
    planta?: DocumentReference,
    realizada?: boolean,
}