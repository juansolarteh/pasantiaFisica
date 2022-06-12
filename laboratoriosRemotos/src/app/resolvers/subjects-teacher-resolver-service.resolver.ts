import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ObjectDB } from '../models/ObjectDB';
import { Subject } from '../models/Subject';
import { SubjectUltimo } from '../models/SubjectUltimo';
import { SubjectService } from '../services/subject.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsTeacherResolverServiceResolver implements Resolve<ObjectDB<SubjectUltimo>[]> {

  constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
  
  resolve(): ObjectDB<SubjectUltimo>[] | Observable<ObjectDB<SubjectUltimo>[]> | Promise<ObjectDB<SubjectUltimo>[]> {
    const user = this.userSvc.getUserLoggedRef()
    return this.subjectSvc.getTeacherSubjects(user);
  }
}
