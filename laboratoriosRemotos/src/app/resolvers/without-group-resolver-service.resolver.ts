import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GroupWithNames } from '../models/Group';
import { ObjectDB } from '../models/ObjectDB';
import { SubjectService } from '../services/subject.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class WithoutGroupResolverServiceResolver implements Resolve<ObjectDB<GroupWithNames>> {
  constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
  
  resolve(): ObjectDB<GroupWithNames> | Observable<ObjectDB<GroupWithNames>> | Promise<ObjectDB<GroupWithNames>> {
    const subjectId = localStorage.getItem('subjectId');
    return this.subjectSvc.getStudentsWithouGroup(subjectId!).then(async refUsers => {
      let users = await this.userSvc.getGroupMembers(refUsers);
      let groupWithNames = new GroupWithNames(users);
      return new ObjectDB<GroupWithNames>(groupWithNames, 'SG');
    });
  }
}
