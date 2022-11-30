import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore';
import { child, get, getDatabase, ref } from 'firebase/database';
import * as moment from 'moment';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { DynamicBooking, SubjectSchedule } from 'src/app/models/subjectSchedule';
import { GroupsService } from 'src/app/services/groups.service';
import { NavbarService } from 'src/app/services/navbar.service';
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
    private groupSvc: GroupsService,
    private _snackBar: MatSnackBar,
    private navbarSvc: NavbarService
  ) { }

  ngOnInit(): void {
    this.subjects = this.route.snapshot.data['subjects'];
    this.subjects.forEach(sub => {
      let uniques: Date[] = []
      sub.getObjectDB().booking?.forEach(bo => {
        let timestamp = bo.date
        let date = new Date(timestamp?.seconds! * 1000)
        if (!uniques.some(uniqueDate => uniqueDate.toLocaleDateString() === date.toLocaleDateString())) {
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
    this.navbarSvc.addSubject(subject)
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  updateSubject(subject: ObjectDB<string>) {
    let index = this.subjects.findIndex(s => s.getId() === subject.getId())
    this.subjects[index].getObjectDB().nameSubject = subject.getObjectDB()
    this.changeDetector.markForCheck();
    this.dialogRef.close();
  }

  onDeleteSubject(contentDialog: any, subject?: ObjectDB<SubjectSchedule>) {
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
        this.navbarSvc.deleteSubject(this.subjectSelected.getId())
        this.subjects = this.subjects.filter((sub) => sub.getId() !== this.subjectSelected.getId());
        this.changeDetector.markForCheck();
      }
    });
  }

  navigateExecution(groupId: string, plantId: string, timestamp: Timestamp) {
    let now = moment()
    let date = moment(timestamp.toDate())
    if (moment().isBefore(date)) {
      this.openSnackBar('Aun no empieza la practica')
    } else if(moment().isBefore(date.add(1, 'h').subtract(6, 'minutes'))){
      const dbref = ref(getDatabase());
      get(child(dbref, "Stream" + plantId)).then((snapshot) => {
        let estado: number = snapshot.val().estado;
        if (estado === 1) {
          this.router.navigate(['../pracExec', groupId, plantId], { relativeTo: this.route })
        } else {
          this.openSnackBar('No hay ningun estudiante en la practica')
        }
      });
    }else{
      this.openSnackBar('La practica esta a punto de terminar, ya no es posible ingresar')
    }
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }
}