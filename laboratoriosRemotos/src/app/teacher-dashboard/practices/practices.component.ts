import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeNameDate } from 'src/app/models/Practice';
import { PracticeService } from 'src/app/services/practice.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PracticesComponent implements OnInit {

  practices: ObjectDB<PracticeNameDate>[] = [];
  newPractice = false;
  practiceSelected!: ObjectDB<PracticeNameDate>;
  practiceUpdatedId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private storageSvc: StorageService,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }

  showPractice(practice: PracticeNameDate) {
    console.log(practice)
  }

  onAddPractice(practice: any | ObjectDB<PracticeNameDate>) {
    if (practice) {
      this.practices.push(practice)
    }
    this.newPractice = false;
  }

  onDeletePractice(contentDialog: any, practice: ObjectDB<PracticeNameDate>) {
    this.practiceSelected = practice;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.practiceSvc.getRefByPracticeId(this.practiceSelected.getId()).then(practiceRef => {
          this.scheduleSvc.deleteFromPracticeReference(practiceRef);
          this.practiceSvc.getDocumentsByPracticeRef(practiceRef).then(pathDocs => {
            this.storageSvc.deleteFiles(pathDocs);
            this.practiceSvc.delete(practiceRef);
          })
        })
        this.practices = this.practices.filter((p) => p !== this.practiceSelected);
        this.changeDetector.markForCheck();
      }
    });
  }

  onModifyPractice(contentDialog: any, practiceId: string) {
    this.practiceUpdatedId = practiceId;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    });
  }
}
