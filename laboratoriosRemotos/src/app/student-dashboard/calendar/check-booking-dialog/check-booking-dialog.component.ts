import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { Subject } from 'src/app/models/Subject';

@Component({
  selector: 'app-check-booking-dialog',
  templateUrl: './check-booking-dialog.component.html',
  styleUrls: ['./check-booking-dialog.component.css']
})
export class CheckBookingDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {studentGroup:ObjectDB<GroupWithNames>,practiceSelected:ObjectDB<Practice>, selectedDate : string, subjectSelected : ObjectDB<Subject>}) { }
  studentGroup!: ObjectDB<GroupWithNames>
  practiceSelected!:ObjectDB<Practice>
  selectedDate : string = ""
  subjectSelected!: ObjectDB<Subject>

  ngOnInit(): void {
    this.studentGroup = this.data.studentGroup
    this.practiceSelected = this.data.practiceSelected
    this.selectedDate = this.data.selectedDate
    this.subjectSelected = this.data.subjectSelected
    console.log(this.studentGroup)
    console.log(this.practiceSelected)
  }

}
