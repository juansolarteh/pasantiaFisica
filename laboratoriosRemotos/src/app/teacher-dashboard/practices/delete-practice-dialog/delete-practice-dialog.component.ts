import { Component, Input, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeNameDate } from 'src/app/models/Practice';

@Component({
  selector: 'app-delete-practice-dialog',
  templateUrl: './delete-practice-dialog.component.html',
  styleUrls: ['./delete-practice-dialog.component.css']
})
export class DeletePracticeDialogComponent implements OnInit {
  @Input() practice!: ObjectDB<PracticeNameDate>;
  constructor() { }

  ngOnInit(): void {
  }

}
