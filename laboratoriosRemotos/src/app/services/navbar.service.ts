import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ObjectDB } from '../models/ObjectDB';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {

    private newSubject = new Subject<ObjectDB<string>>();
    private oldSubjectId = new Subject<string>();

    constructor() { }

    addSubject(subject: ObjectDB<string>) {
        this.newSubject.next(subject)
    }

    deleteSubject(subjectId: string) {
        this.oldSubjectId.next(subjectId)
    }

    getNewSubject() {
        return this.newSubject
    }

    getOldSubject() {
        return this.oldSubjectId
    }
}
