import { DocumentData } from '@angular/fire/compat/firestore';
import { UserService } from 'src/app/services/user.service';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { GroupsService } from 'src/app/services/groups.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { PracticeService } from './../../services/practice.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Group } from 'src/app/models/Group';

@Injectable({
  providedIn: 'root'
})
export class CalendarStudentResolver implements Resolve<DocumentData> {
  constructor(private practiceSvc: PracticeService, private subjectSvc: SubjectService, private scheduleSvc: ScheduleService,
    private groupSvc: GroupsService, private userSvc: UserService) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<DocumentData> {
    const subjectId = route.parent?.paramMap.get('subjectId')
    const practiceId = route.paramMap.get('practiceId')
    const userRef = this.userSvc.getUserLoggedRef()
    let refSubject = this.subjectSvc.getRefSubjectFromId(subjectId)
    let refPractice = await this.practiceSvc.getRefByPracticeId(practiceId)
    let refsSubjectGroups = await this.subjectSvc.getRefGroupsFromSubjectId(subjectId)
    let refGroup = await this.groupSvc.getGroupRefByStudentRef(refsSubjectGroups, userRef)
    if (!refGroup) {
      return undefined
    }
    let response = await this.scheduleSvc.getBooking(refSubject, refPractice, refGroup)
    return response
  }
}
