import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  dialogRefUpdate!: MatDialogRef<unknown, any>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private storageSvc: StorageService,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.practices = data['practices']
    })
  }

  goPractice(practiceId: string) {
    this.router.navigate(['practice', practiceId], { relativeTo: this.route.parent?.parent });
  }

  onAddPractice(practice: any | ObjectDB<PracticeNameDate>) {
    if (practice) {
      let auxArray = [practice]
      this.practices = auxArray.concat(this.practices)
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
    this.dialogRefUpdate = this.dialog.open(contentDialog)
  }

  updatePractice($event: any){
    let practiceND: ObjectDB<PracticeNameDate> = $event
    let index = this.practices.findIndex(p => p.getId() === practiceND.getId())
    this.practices[index] = practiceND
    this.changeDetector.markForCheck();
    this.dialogRefUpdate.close()
  }
}
