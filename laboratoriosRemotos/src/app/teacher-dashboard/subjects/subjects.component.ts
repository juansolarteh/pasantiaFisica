import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { DynamicBooking, SubjectSchedule } from 'src/app/models/subjectSchedule';
import { GroupsService } from 'src/app/services/groups.service';
import { PracticeService } from 'src/app/services/practice.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<SubjectSchedule>[] = [];
  subjectSelected!: ObjectDB<SubjectSchedule>;
  dialogRef!: MatDialogRef<unknown, any>

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private subjectSvc: SubjectService,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private groupSvc: GroupsService
  ) { }

  ngOnInit(): void {
    this.subjects = this.route.snapshot.data['subjects'];
    this.subjects.forEach(sub => {
      let uniques: Date[] = []
      sub.getObjectDB().booking?.forEach(bo => {
        let timestamp = bo.date
        let date = new Date(timestamp?.seconds! * 1000) 
        if(!uniques.some(uniqueDate => uniqueDate.toLocaleDateString() === date.toLocaleDateString())){
          uniques.push(date)
          bo.shown = true;
        }
      })
    })
  }

  goToSubject(subjectId: string) {
    this.router.navigate(['../subject', subjectId], { relativeTo: this.route });
  }

  openModal(contentDialog: any, subject?: ObjectDB<SubjectSchedule>) {
    this.subjectSelected = subject!;
    this.dialogRef = this.dialog.open(contentDialog)
  }

  addSubject(subject: ObjectDB<string>) {
    let sub: SubjectSchedule = {
      booking: [],
      nameSubject: subject.getObjectDB()
    }
    this.subjects.push(new ObjectDB(sub, subject.getId()));
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  updateSubject(subject: ObjectDB<string>) {
    let index = this.subjects.findIndex(s => s.getId() === subject.getId())
    this.subjects[index].getObjectDB().nameSubject = subject.getObjectDB()
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  onDeleteSubject(contentDialog: any, subject?: ObjectDB<SubjectSchedule>){
    this.subjectSelected = subject!;
    this.dialogRef = this.dialog.open(contentDialog)
    this.dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const subjectRef = this.subjectSvc.getRefSubjectFromId(this.subjectSelected.getId());
        const groupRefs = await this.subjectSvc.getRefGroupsFromSubjectId(this.subjectSelected.getId());
        var practicesRef = await this.practiceSvc.getPracticesRefFromSubjectRef(subjectRef);
        this.subjectSvc.deleteFromReference(subjectRef);
        groupRefs.forEach(group => {
          this.groupSvc.deleteGroup(group);
        })
        practicesRef.forEach(prtRef => {
          this.scheduleSvc.deleteFromPracticeReference(prtRef);
          this.practiceSvc.delete(prtRef);
        });
        this.subjects = this.subjects.filter((sub) => sub.getId() !== this.subjectSelected.getId());
        this.changeDetector.markForCheck();
      }
    });
  }

  navigateExecution(groupId: string){
    this.router.navigate(['../pracExec', groupId], { relativeTo: this.route })
  }
}