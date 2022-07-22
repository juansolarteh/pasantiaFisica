import { GroupsService } from 'src/app/services/groups.service';
import { CheckBookingDialogComponent } from './check-booking-dialog/check-booking-dialog.component';
import { Timestamp } from '@firebase/firestore';
import { ScheduleService } from 'src/app/services/schedule.service';
import { PracticeService } from 'src/app/services/practice.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular';
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

  @ViewChild('calendar') calendar!: FullCalendarComponent;
  practices: ObjectDB<Practice>[] = []
  practiceSelected!: ObjectDB<Practice>
  practiceBookings: Object[] = []
  studentGroup!: ObjectDB<GroupWithNames>
  subjectSelected!: ObjectDB<Subject>
  groupBooked: boolean = false

  constructor(private activatedRoute: ActivatedRoute,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private groupSvc: GroupsService,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public checkBookingDialog: MatDialog,
    private readonly router: Router) { }


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
  onGoToGroups() {
    console.log(this.activatedRoute.url);
    this.router.navigate(['groups'])
  }
  handleDateClick(arg: any) {
    if (this.practiceSelected) {
      let selectedDate = this.datePipe.transform(arg.startStr, "yyyy-MM-ddTHH:mm:ss")!
      let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")!
      if (this.isValidSelectedDate(selectedDate, currentDate) && this.isSelectedDateInBookingRange(selectedDate)) {
        let dialogRef = this.checkBookingDialog.open(CheckBookingDialogComponent, { data: { studentGroup: this.studentGroup, practiceSelected: this.practiceSelected, selectedDate: selectedDate, subjectSelected: this.subjectSelected }, height: 'auto', width: '600px' })
        const dialogSuscription = dialogRef.componentInstance.onBookingCreated.subscribe(dateBooking => {
          let dateBookingStart = this.datePipe.transform(dateBooking.seconds * 1000, "yyyy-MM-ddTHH:mm:ss")
          let dateBookingEnd = this.datePipe.transform((dateBooking.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
          let newEvent = { title: 'Planta Reservada', start: dateBookingStart, end: dateBookingEnd }
          this.practiceBookings.push(newEvent)
          this.calendar.getApi().removeAllEvents()
          this.calendar.getApi().addEventSource(this.practiceBookings)
          this.openSnackBar("Agendamiento creado exitosamente", "Cerrar")
          dialogSuscription.unsubscribe()
        })
      } else {
        this.openSnackBar("Seleccione una fecha válida", "Cerrar")
      }
    } else {
      this.openSnackBar("Seleccione una práctica para ver sus reservas", "Cerrar")
    }
  }

  private async initializeView() {
    /* if(await this.isGroupBooked()){
      this.groupBooked =  true
    } */
    let calendarDateStart = this.datePipe.transform(this.practiceSelected.getObjectDB().getInicio().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")?.toString()
    let calendarDateEnd = this.datePipe.transform(this.practiceSelected.getObjectDB().getFin().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")?.toString()
    this.calendarOptions.initialDate = calendarDateStart
    this.calendarOptions.validRange = {
      start: calendarDateStart,
      end: calendarDateEnd
    }
    this.calendar.getApi().removeAllEvents()
    this.practiceBookings = []
  }

  /* private async isGroupBooked() {
    let groupRef = await this.groupSvc.getGroupRefById(this.studentGroup.getId())
    let practiceRef = await this.practiceSvc.getRefByPracticeId(this.practiceSelected.getId())
    let isGroupBooked = await this.scheduleSvc.isGroupBooked(groupRef, practiceRef)
    return isGroupBooked
  } */
  private setBookingsOnCalendar(bookings: Timestamp[]) {
    bookings.map(booking => {
      let newEvent = {
        title: 'Planta Reservada',
        start: this.datePipe.transform(booking.seconds * 1000, "yyyy-MM-ddTHH:mm:ss"),
        end: this.datePipe.transform((booking.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
      }
      this.practiceBookings.push(newEvent)
    })
    this.calendar.getApi().addEventSource(this.practiceBookings)
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
