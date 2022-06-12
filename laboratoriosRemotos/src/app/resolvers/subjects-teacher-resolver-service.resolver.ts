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
export class SubjectsTeacherResolverServiceResolver implements Resolve<ObjectDB<string>[]> {

  constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
  
  resolve(): ObjectDB<string>[] | Observable<ObjectDB<string>[]> | Promise<ObjectDB<string>[]> {
    const user = this.userSvc.getUserLoggedRef();
    return this.subjectSvc.getNameSubjects(user);
  }
}