import { Injectable } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Resolve } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ObjectDB } from '../models/ObjectDB';
import { SubjectSchedule } from '../models/subjectSchedule';
import { PracticeService } from '../services/practice.service';
import { ScheduleService } from '../services/schedule.service';
import { SubjectService } from '../services/subject.service';
import { TimestampService } from '../services/timestamp.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectsTeacherResolverServiceResolver implements Resolve<ObjectDB<SubjectSchedule>[]> {

  constructor(
    private subjectSvc: SubjectService,
    private userSvc: UserService,
    private scheduleSvc: ScheduleService,
    private practiceSvc: PracticeService,
    private timestampSvc: TimestampService
  ) { }

  resolve(): Promise<ObjectDB<SubjectSchedule>[]> {
    const user = this.userSvc.getUserLoggedRef();
    return this.subjectSvc.getNameSubjects(user).then(async subjNameDB => {
      let nameRefDB = subjNameDB.map(subjDB => {
        let ref = this.subjectSvc.getRefSubjectFromId(subjDB.getId())
        return new ObjectDB({
          nameSub: subjDB.getObjectDB(),
          refSub: ref,
        }, subjDB.getId())
      })
      let promSubjSched = nameRefDB.map(async nrDB => {
        return await this.scheduleSvc.getBookingsAndPracticeBySubjectRef(nrDB.getObjectDB().refSub).then(async bookingRefs => {
          bookingRefs = bookingRefs.filter(br => this.timestampSvc.todayOrBeforeOf(br.date!, 4))
          bookingRefs.sort((a, b) => moment(a.date?.toDate()).diff(b.date?.toDate()))
          let promises = bookingRefs.map(async br => {
            let namePractice = await this.practiceSvc.getPracticeName(br.practice as DocumentReference)
            br.practice = namePractice;
            return br
          })
          let bookingNames = await Promise.all(promises)
          let subjSchedule: SubjectSchedule = {
            booking: bookingNames,
            nameSubject: nrDB.getObjectDB().nameSub
          }
          return new ObjectDB(subjSchedule, nrDB.getId())
        })
      })
      return await Promise.all(promSubjSched)
    })
  }
}