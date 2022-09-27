import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { Subject } from 'src/app/models/Subject';

@Component({
  selector: 'app-report-anomaly',
  templateUrl: './report-anomaly.component.html',
  styleUrls: ['./report-anomaly.component.css']
})
export class ReportAnomalyComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    student: {}, studentGroup: ObjectDB<GroupWithNames>, practiceSelected: ObjectDB<Practice>,
    dateReport: string, subjectSelected: ObjectDB<Subject>
  },) { }

  studentGroup!: ObjectDB<GroupWithNames>
  practiceSelected!: ObjectDB<Practice>
  dateReport: string = ""
  subjectSelected!: ObjectDB<Subject>
  ngOnInit(): void {
    this.studentGroup = this.data.studentGroup
    this.practiceSelected = this.data.practiceSelected
    this.dateReport = this.data.dateReport
    this.subjectSelected = this.data.subjectSelected
  }

}
