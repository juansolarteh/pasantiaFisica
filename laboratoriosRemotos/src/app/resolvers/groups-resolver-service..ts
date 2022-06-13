import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { GroupsService } from '../services/groups.service';
import { ObjectDB } from '../models/ObjectDB';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<ObjectDB<Group>[]> {
  constructor(private subjectSvc: SubjectService, private groupSvc: GroupsService) { }
  resolve(): ObjectDB<Group>[] | Observable<ObjectDB<Group>[]> | Promise<ObjectDB<Group>[]> {
    const subject = this.subjectSvc.getRefSubjectSelected()
    return this.groupSvc.getFromSubjectRef(subject)
  }
}
