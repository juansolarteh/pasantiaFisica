import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeNameDate } from 'src/app/models/Practice';
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

  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private storageSvc: StorageService) { }

  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }

  showPractice(practice: PracticeNameDate){
    console.log(practice)
  }

  onAddPractice(practice: any | ObjectDB<PracticeNameDate>){
    if (practice){
      this.practices.push(practice)
    }
    this.newPractice = false;
  }

  onDeletePractice(contentDialog: any, practice: ObjectDB<PracticeNameDate>){
    this.practiceSelected = practice;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let task = this.storageSvc.deleteFilesFromPractice('asd', 'dasdss')
      }
    });
  }
}
