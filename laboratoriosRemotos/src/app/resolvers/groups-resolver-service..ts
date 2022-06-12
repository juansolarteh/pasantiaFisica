import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { GroupsService } from '../services/groups.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<any[]> {
  constructor(private subjectSvc: SubjectService, private grupoSvc: GroupsService) { }
  resolve(): any[] | Observable<any[]> | Promise<any[]> {
    var subjectId = localStorage.getItem('subject')
    if (!subjectId){
      subjectId = 'nn'
    }
    const subject = this.subjectSvc.getSubject(subjectId)
    return this.grupoSvc.getFromSubjectRef(subject)
  }
}
