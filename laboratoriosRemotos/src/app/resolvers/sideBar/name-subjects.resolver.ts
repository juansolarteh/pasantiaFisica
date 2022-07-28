import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ObjectDB } from '../../models/ObjectDB';
import { SubjectService } from '../../services/subject.service';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class NameSubjectsResolver implements Resolve<ObjectDB<string>[]> {

  constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ObjectDB<string>[]> {
    const user = this.userSvc.getUserLoggedRef();
    const subjNameDB = await this.subjectSvc.getNameSubjects(user);
    return subjNameDB;
  }
}
