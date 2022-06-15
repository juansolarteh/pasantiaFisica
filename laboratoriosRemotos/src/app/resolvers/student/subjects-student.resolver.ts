import { Subject } from './../../models/Subject';
import { ObjectDB } from './../../models/ObjectDB';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';


@Injectable({
    providedIn: 'root'
  })
export class SubjectsStudentResolverService implements  Resolve<ObjectDB<Subject>[]>{
    constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
    
    resolve(): ObjectDB<Subject>[] | Observable<ObjectDB<Subject>[]> | Promise<ObjectDB<Subject>[]> {
        const user = this.userSvc.getUserLoggedRef();
        return this.subjectSvc.getSubjectsFromStudent(user);
    }
}