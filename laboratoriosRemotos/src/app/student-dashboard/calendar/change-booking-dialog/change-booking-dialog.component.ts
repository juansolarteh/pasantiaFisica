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
  selector: 'app-change-booking-dialog',
  templateUrl: './change-booking-dialog.component.html',
  styleUrls: ['./change-booking-dialog.component.css']
})
export class ChangeBookingDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    studentGroup: ObjectDB<GroupWithNames>, practiceSelected: ObjectDB<Practice>,
    newDate: string, event: Booking, subjectSelected: ObjectDB<Subject>
  }, private bookingSvc : ScheduleService) { }

  studentGroup!: ObjectDB<GroupWithNames>
  practiceSelected!: ObjectDB<Practice>
  newDate: string = ""
  previousDate!: Timestamp
  subjectSelected!: ObjectDB<Subject>
  event! : Booking
  onBookingUpdated : EventEmitter<Booking> = new EventEmitter<Booking>()

  ngOnInit(): void {
    this.studentGroup = this.data.studentGroup
    this.practiceSelected = this.data.practiceSelected
    this.newDate = this.data.newDate
    this.subjectSelected = this.data.subjectSelected
    this.previousDate = this.data.event.fecha!
    this.event = this.data.event
  }

  onChangeBooking() {
    this.event.fecha = Timestamp.fromDate(new Date(this.newDate))
    this.bookingSvc.updateBooking(this.event.id!,this.event.fecha)
    this.onBookingUpdated.emit(this.event)
  }
}
