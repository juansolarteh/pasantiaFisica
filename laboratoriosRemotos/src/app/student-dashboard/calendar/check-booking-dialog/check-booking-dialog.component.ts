import { SubjectService } from 'src/app/services/subject.service';
import { Timestamp } from '@firebase/firestore';
import { ScheduleService } from 'src/app/services/schedule.service';
import { GroupsService } from 'src/app/services/groups.service';
import { PracticeService } from './../../../services/practice.service';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { Subject } from 'src/app/models/Subject';
import { Booking } from 'src/app/models/Booking';

@Component({
  selector: 'app-check-booking-dialog',
  templateUrl: './check-booking-dialog.component.html',
  styleUrls: ['./check-booking-dialog.component.css']
})
export class CheckBookingDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {studentGroup:ObjectDB<GroupWithNames>,practiceSelected:ObjectDB<Practice>,
    selectedDate : string, subjectSelected : ObjectDB<Subject>},
    private practiceSvc : PracticeService, private groupSvc : GroupsService,
    private bookingSvc : ScheduleService, private subjectSvc : SubjectService) { }

  studentGroup!: ObjectDB<GroupWithNames>
  practiceSelected!:ObjectDB<Practice>
  selectedDate : string = ""
  subjectSelected!: ObjectDB<Subject>
  onBookingCreated : EventEmitter<Timestamp> = new EventEmitter<Timestamp>()
  
  ngOnInit(): void {
    this.studentGroup = this.data.studentGroup
    this.practiceSelected = this.data.practiceSelected
    this.selectedDate = this.data.selectedDate
    this.subjectSelected = this.data.subjectSelected
    console.log(this.practiceSelected);
  }

  onCreateBooking(){
    this.groupSvc.getGroupRefById(this.studentGroup.getId()).then(group =>{
      this.practiceSvc.getRefByPracticeId(this.practiceSelected.getId()).then(practice=>{
        let refSubject = this.subjectSvc.getRefSubjectFromId(this.subjectSelected.getId())
        let date = new Date(this.selectedDate)
        let dateBooking = Timestamp.fromDate(date)
        let newBooking : Booking = {
          fecha: dateBooking,
          grupo: group,
          practica: practice,
          materia: refSubject
        }
        this.bookingSvc.createBooking(newBooking)
        this.onBookingCreated.emit(dateBooking)
      })
    })
  }
}
