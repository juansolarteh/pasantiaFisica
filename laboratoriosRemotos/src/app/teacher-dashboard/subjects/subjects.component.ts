import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.subjects = this.route.snapshot.data['subjects'];

  }

  goToSubject(subjectId: string) {
    this.router.navigate(['../subject', subjectId], { relativeTo: this.route });
  }

  onAddSubject(contentDialog: any){
    this.dialogRef = this.dialog.open(contentDialog)
  }

  addSubject($event: any){
    this.dialogRef.close()
  }
}
