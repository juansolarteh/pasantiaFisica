import { Timestamp } from '@firebase/firestore';
import { DocumentReference } from '@angular/fire/compat/firestore';

export interface Booking{
    fecha?: Timestamp,
    grupo?: DocumentReference,
    practica?: DocumentReference
}