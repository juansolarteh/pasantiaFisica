import { CheckBookingDialogComponent } from './check-booking-dialog/check-booking-dialog.component';
import { Timestamp } from '@firebase/firestore';
import { ScheduleService } from 'src/app/services/schedule.service';
import { PracticeService } from 'src/app/services/practice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/angular';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupWithNames } from 'src/app/models/Group';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'src/app/models/Subject';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  practices: ObjectDB<Practice>[] = []
  practiceSelected!: ObjectDB<Practice>
  practiceBookings: Object[] = []
  studentGroup!: ObjectDB<GroupWithNames>
  subjectSelected!: ObjectDB<Subject>
  
  constructor(private activatedRoute: ActivatedRoute,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public checkBookingDialog: MatDialog) { }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    weekends: false,
    slotLabelInterval: 1,
    slotEventOverlap: false,
    allDaySlot: false,
    height: 500,
    expandRows: true,
    selectable: true,
    editable: false,
    slotDuration: '00:60:00',
    eventBackgroundColor: "#6d1a1d",
    eventBorderColor: "#6d1a1d",
    nowIndicator: true,
    buttonText: {
      today: "Hoy"
    },
    buttonHints: {
      prev: 'Anterior',
      next: 'Siguiente',
      today: 'Hoy'
    },
    views: {
      timeGridWeek: { buttonText: 'Semana' },
      timeGridDay: { buttonText: 'Día' },
    },
    select: this.handleDateClick.bind(this),
    locale: "es",
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '19:00:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
    },
    displayEventTime: false
  }
  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
  }
  onPracticeSelected(practice: ObjectDB<Practice>) {
    this.practiceSelected = practice
    this.initializeView()
    this.practiceSvc.getRefByPracticeId(this.practiceSelected.getId()).then(async res => {
      let bookings = await this.scheduleSvc.getBookingsByPracticeRef(res)
      if (bookings.length > 0) this.setBookingsOnCalendar(bookings)
    })
  }

  handleDateClick(arg: any) {
    if (this.practiceSelected) {
      let selectedDate = this.datePipe.transform(arg.startStr, "yyyy-MM-ddTHH:mm:ss")!
      let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")!
      if (this.isValidSelectedDate(selectedDate,currentDate) && this.isSelectedDateInBookingRange(selectedDate)) {
        let dialogRef = this.checkBookingDialog.open(CheckBookingDialogComponent,
          { data: { studentGroup: this.studentGroup, practiceSelected: this.practiceSelected, selectedDate: selectedDate, subjectSelected : this.subjectSelected }, height: 'auto', width: '600px' })
        dialogRef.afterClosed().subscribe(res => {
          console.log(res)
        })
      } else {
        this.openSnackBar("Seleccione una fecha válida", "Cerrar")
      }
    } else {
      this.openSnackBar("Seleccione una práctica para ver sus reservas", "Cerrar")
    }
  }

  private initializeView() {
    let calendarDateStart = this.practiceSelected.getObjectDB().getInicio().seconds * 1000
    //let calendarDateEnd = this.practiceSelected.getObjectDB().getFin().seconds*1000
    this.calendarOptions.validRange = {
      start: this.datePipe.transform(calendarDateStart, "yyyy-MM-ddTHH:mm:ss")?.toString(),
    }
    this.calendarOptions.events = undefined
    this.practiceBookings = []
  }
  private setBookingsOnCalendar(bookings: Timestamp[]) {
    bookings.map(booking => {
      let newEvent = {
        title: 'Planta Reservada',
        start: this.datePipe.transform(booking.seconds * 1000, "yyyy-MM-ddTHH:mm:ss"),
        end: this.datePipe.transform((booking.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
      }
      this.practiceBookings.push(newEvent)
    })
    this.calendarOptions.events = this.practiceBookings
  }

  private isValidSelectedDate(selectedDate: string, currentDate: string) {
    if (moment(selectedDate).isSameOrAfter(currentDate)) return true
    return false
  }

  private isSelectedDateInBookingRange(selectedDate: string) {
    let startBookingDate = this.datePipe.transform(this.practiceSelected.getObjectDB().getInicio().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")
    let endBookingDate = this.datePipe.transform(this.practiceSelected.getObjectDB().getFin().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")
    if (moment(selectedDate).isSameOrAfter(startBookingDate) && moment(selectedDate).isBefore(endBookingDate)) return true
    return false
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
