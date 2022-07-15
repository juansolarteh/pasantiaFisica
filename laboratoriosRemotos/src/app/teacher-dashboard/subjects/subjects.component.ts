import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentReference } from '@firebase/firestore';
import { ObjectDB } from 'src/app/models/ObjectDB';
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

  subjects: ObjectDB<string>[] = [];
  subjectSelected!: ObjectDB<string>;
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
  }

  goToSubject(subjectId: string) {
    this.router.navigate(['../subject', subjectId], { relativeTo: this.route });
  }

  openModal(contentDialog: any, subject?: ObjectDB<string>) {
    this.subjectSelected = subject!;
    this.dialogRef = this.dialog.open(contentDialog)
  }

  addSubject(subject: ObjectDB<string>) {
    this.subjects.push(subject);
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  updateSubject(subject: ObjectDB<string>) {
    let index = this.subjects.findIndex(s => s.getId() === subject.getId())
    this.subjects[index].setObjectDB(subject.getObjectDB())
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  onDeleteSubject(contentDialog: any, subject?: ObjectDB<string>){
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
}