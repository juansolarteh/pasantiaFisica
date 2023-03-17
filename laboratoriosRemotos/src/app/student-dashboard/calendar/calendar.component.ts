import { ChangeBookingDialogComponent } from './change-booking-dialog/change-booking-dialog.component';
import { Booking } from 'src/app/models/Booking';
import { GroupsService } from 'src/app/services/groups.service';
import { CheckBookingDialogComponent } from './check-booking-dialog/check-booking-dialog.component';
import { Timestamp } from '@firebase/firestore';
import { ScheduleService } from 'src/app/services/schedule.service';
import { PracticeService } from 'src/app/services/practice.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar') calendar!: FullCalendarComponent;

  practiceSelected!: ObjectDB<Practice>
  auxBooking: Object[] = []
  plantBookings: Booking[] = []
  studentGroup!: ObjectDB<GroupWithNames>
  subjectSelected!: ObjectDB<Subject>

  constructor(private activatedRoute: ActivatedRoute,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private groupSvc: GroupsService,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public checkBookingDialog: MatDialog,
    public changeBookingDialogComponent: MatDialog,
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

  ngAfterViewInit(): void {

    if (this.studentGroup) {
      this.initializeView()
      this.scheduleSvc.getBookingsStudentByPlantRef(this.practiceSelected.getObjectDB().getPlanta()).then(bookings => {
        if (bookings.length > 0) this.setBookingsOnCalendar(bookings)
      })
    }

  }

  ngOnInit(): void {
    this.practiceSelected = this.activatedRoute.snapshot.data['practiceSelected'];
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    //console.log(this.studentGroup);

  }

  onGoToGroups() {
    console.log(this.activatedRoute.url);
    this.router.navigate(['./groups'], { relativeTo: this.activatedRoute.parent })
  }
  async handleDateClick(arg: any) {
    let selectedDate = this.datePipe.transform(arg.startStr, "yyyy-MM-ddTHH:mm:ss")!
    let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")!
    if (!this.isDateBooked(selectedDate)) {
      if (this.isValidSelectedDate(selectedDate, currentDate) && this.isSelectedDateInBookingRange(selectedDate)) {
        if (this.isCurrentDateBeforeSelectedDate(selectedDate, currentDate)) {
          let existingEvent = this.isGroupBooked()
          if (existingEvent == undefined) {
            let dialogRef = this.checkBookingDialog.open(CheckBookingDialogComponent, { data: { studentGroup: this.studentGroup, practiceSelected: this.practiceSelected, selectedDate: selectedDate, subjectSelected: this.subjectSelected }, height: 'auto', width: '600px' })
            const dialogSuscription = dialogRef.componentInstance.onBookingCreated.subscribe(newBooking => {
              this.onAddBooking(newBooking)
              dialogSuscription.unsubscribe()
            })
          } else {
            let dialogRef = this.changeBookingDialogComponent.open(ChangeBookingDialogComponent,
              { data: { studentGroup: this.studentGroup, practiceSelected: this.practiceSelected, newDate: selectedDate, event: existingEvent, subjectSelected: this.subjectSelected }, height: 'auto', width: '600px' })
            const dialogSuscription = dialogRef.componentInstance.onBookingUpdated.subscribe(res => {
              this.onUpdateBooking(res)
              dialogSuscription.unsubscribe()
            })
          }
        } else {
          this.openSnackBar("El agendamiento solo puede realizarse máximo hasta cinco minutos antes de la fecha seleccionada", "Cerrar")
        }
      } else {
        this.openSnackBar("Seleccione una fecha válida", "Cerrar")
      }
    }
  }

  private onUpdateBooking(updatedBooking: Booking) {
    let dateBookingStart = this.datePipe.transform(updatedBooking.fecha!.seconds * 1000, "yyyy-MM-ddTHH:mm:ss")
    let dateBookingEnd = this.datePipe.transform((updatedBooking.fecha!.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
    let aux = this.auxBooking.filter((booking: Booking) => booking.id != updatedBooking.id)
    this.auxBooking = aux
    let newEvent = { id: updatedBooking.id, title: 'Planta Reservada', start: dateBookingStart, end: dateBookingEnd, groupRef: updatedBooking.grupo, practiceRef: updatedBooking.practica }
    this.auxBooking.push(newEvent)
    let aux2 = this.plantBookings.filter(booking => booking.id != updatedBooking.id)
    this.plantBookings = aux2
    this.plantBookings.push(updatedBooking)
    this.calendar.getApi().removeAllEvents()
    this.calendar.getApi().addEventSource(this.auxBooking)
    this.openSnackBar("Agendamiento actualizado exitosamente", "Cerrar")
  }
  private onAddBooking(newBooking: Booking) {
    let dateBookingStart = this.datePipe.transform(newBooking.fecha!.seconds * 1000, "yyyy-MM-ddTHH:mm:ss")
    let dateBookingEnd = this.datePipe.transform((newBooking.fecha!.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
    let newEvent = { id: newBooking.id, title: 'Planta Reservada', start: dateBookingStart, end: dateBookingEnd, groupRef: newBooking.grupo, practiceRef: newBooking.practica }
    this.auxBooking.push(newEvent)
    this.plantBookings.push(newBooking)
    this.calendar.getApi().removeAllEvents()
    this.calendar.getApi().addEventSource(this.auxBooking)
    this.openSnackBar("Agendamiento creado exitosamente", "Cerrar")
  }
  private async initializeView() {
    let calendarDateStart = this.datePipe.transform(this.practiceSelected.getObjectDB().getInicio().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")?.toString()
    let calendarDateEnd = this.datePipe.transform(this.practiceSelected.getObjectDB().getFin().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")?.toString()
    this.calendarOptions.validRange = {
      start: calendarDateStart,
      end: calendarDateEnd
    }
    this.calendar.getApi().removeAllEvents()
    this.auxBooking = []
  }

  private isGroupBooked() {
    let booking = this.plantBookings.find(booking => booking.grupo?.id == this.studentGroup.getId() && booking.practica?.id == this.practiceSelected.getId())
    return booking
  }
  private setBookingsOnCalendar(bookings: Booking[]) {
    bookings.map(booking => {
      let newEvent = {
        id: booking.id,
        title: 'Planta Reservada',
        start: this.datePipe.transform(booking.fecha!.seconds * 1000, "yyyy-MM-ddTHH:mm:ss"),
        end: this.datePipe.transform((booking.fecha!.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss"),
        groupRef: booking.grupo,
        practiceRef: booking.practica
      }
      this.auxBooking.push(newEvent)
      this.plantBookings.push(booking)
    })
    this.calendar.getApi().addEventSource(this.auxBooking)
  }

  private isDateBooked(selectedDate: string) {
    const validate = this.calendar.getApi().getEvents().some(event => this.datePipe.transform(event.start, "yyyy-MM-ddTHH:mm:ss") == selectedDate)
    return validate
  }
  private isValidSelectedDate(selectedDate: string, currentDate: string) {
    if (moment(selectedDate).isSameOrAfter(currentDate)) {
      return true
    }
    return false
  }

  private isCurrentDateBeforeSelectedDate(selectedDate: string, currentDate: string) {
    let validDate = moment(selectedDate).subtract(5, 'minutes')
    if (moment(currentDate).isAfter(validDate)) {
      return false
    }
    return true
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
