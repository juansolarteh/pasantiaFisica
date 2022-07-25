import { DocumentReference } from "@angular/fire/compat/firestore";
import { Timestamp } from "@firebase/firestore"

export class SubjectSchedule {
    nameSubject?: string;
    booking?: DynamicBooking[]
}

export class DynamicBooking {
    date?: Timestamp;
    practice?: string | DocumentReference;
    groupId?: string;
    shown?: boolean;
}