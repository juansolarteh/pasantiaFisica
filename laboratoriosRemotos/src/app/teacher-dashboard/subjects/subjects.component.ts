import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<string>[] = [];
  idSelectedSubject!: string;
  dialogRef!: MatDialogRef<unknown, any>

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subjects = this.route.snapshot.data['subjects'];
  }

  goToSubject(subjectId: string) {
    this.router.navigate(['../subject', subjectId], { relativeTo: this.route });
  }

  openModal(contentDialog: any, subjectId?: string){
    if (subjectId){
      this.idSelectedSubject = subjectId;
    }
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
}
