import { DatePipe } from '@angular/common';
import { GroupsService } from 'src/app/services/groups.service';
import { EmailService } from './../../services/email.service';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    student: {}, studentGroup: ObjectDB<GroupWithNames>, practiceSelected: ObjectDB<Practice>,
    dateReport: string, subjectSelected: ObjectDB<Subject>}, private emailSvc : EmailService, private datePipe : DatePipe) { }

  studentGroup!: ObjectDB<GroupWithNames>
  practiceSelected!: ObjectDB<Practice>
  dateReport: string = ""
  subjectSelected!: ObjectDB<Subject>
  anomalyDetails : string = ""

  ngOnInit(): void {
    this.studentGroup = this.data.studentGroup
    this.practiceSelected = this.data.practiceSelected
    this.dateReport = this.data.dateReport
    this.subjectSelected = this.data.subjectSelected
  }

  onSendReport(){
    let studentsString = ""
    this.studentGroup.getObjectDB().getGrupo().forEach(student=> studentsString = studentsString + student.getName() + ' - ')
    let data = {
      date : this.datePipe.transform(this.dateReport,'MMM d, y, h:mm:ss a', 'es-ES') ,
      report: this.anomalyDetails,
      practice : this.practiceSelected.getObjectDB().getNombre() ,
      subject: this.subjectSelected.getObjectDB().getNombre(),
      students : studentsString
    }
    this.emailSvc.sendEmail(data)
  }

}
