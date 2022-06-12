import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { GroupsService } from '../services/groups.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<any[]> {
  constructor(private subjectSvc: SubjectService, private groupSvc: GroupsService) { }
  resolve(): any[] | Observable<any[]> | Promise<any[]> {
    const subject = this.subjectSvc.getRefSubjectSelected()
    return this.groupSvc.getFromSubjectRef(subject)
  }
}
