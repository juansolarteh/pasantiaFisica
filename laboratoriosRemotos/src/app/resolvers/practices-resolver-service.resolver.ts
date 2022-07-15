import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Resolve } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { PracticeService } from '../services/practice.service';
import { ObjectDB } from '../models/ObjectDB';
import { PracticeNameDate } from '../models/Practice';

@Injectable({
  providedIn: 'root'
})
export class PracticesResolverServiceResolver implements Resolve<ObjectDB<PracticeNameDate>[]> {

  constructor(private subjectSvc: SubjectService, private practiceSvc: PracticeService) { }

  resolve(): Promise<ObjectDB<PracticeNameDate>[]> {
    let subjectRef: DocumentReference = this.subjectSvc.getRefSubjectSelected();
    return this.practiceSvc.getPracticesNameDate(subjectRef);
  }
}
