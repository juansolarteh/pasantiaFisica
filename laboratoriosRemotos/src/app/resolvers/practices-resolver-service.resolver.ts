import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { PracticeService } from '../services/practice.service';
import { ObjectDB } from '../models/ObjectDB';
import { Practice } from '../models/Practice';

@Injectable({
  providedIn: 'root'
})
export class PracticesResolverServiceResolver implements Resolve<ObjectDB<Practice>[]> {

  constructor(private subjectSvc: SubjectService, private practiceSvc: PracticeService) { }

  resolve(): ObjectDB<Practice>[] | Observable<ObjectDB<Practice>[]> | Promise<ObjectDB<Practice>[]> {
    const subjectId = localStorage.getItem('subjectId');
    let subjectRef: DocumentReference = this.subjectSvc.getRefSubjectFromId(subjectId!);
    return this.practiceSvc.getPracticesFromSubjectRef(subjectRef);
  }
}
