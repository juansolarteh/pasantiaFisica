import { Timestamp } from '@firebase/firestore';
import { ScheduleService } from 'src/app/services/schedule.service';
import { PracticeService } from 'src/app/services/practice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/angular';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  practices: ObjectDB<Practice>[] = []
  practiceSelected!: ObjectDB<Practice>
  practiceBookings: Object[] = []
  constructor(private activatedRoute: ActivatedRoute, private practiceSvc: PracticeService, private scheduleSvc: ScheduleService, private datePipe: DatePipe) { }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    weekends: false,
    slotLabelInterval: 1,
    slotEventOverlap: false,
    allDaySlot: false,
    selectable: true,
    editable: false,
    slotDuration: '00:60:00',
    eventBackgroundColor: "#6d1a1d",
    eventBorderColor: "#6d1a1d",
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
    slotMaxTime: '18:00:00',
  }
  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }

  handleDateClick(arg: any) {
    alert("click")
  }

  getPracticeSelected(practice: ObjectDB<Practice>) {
    this.calendarOptions.events = undefined
    this.practiceBookings = []
    this.practiceSelected = practice
    this.practiceSvc.getRefByPracticeId(this.practiceSelected.getId()).then(async res => {
      let bookings = await this.scheduleSvc.getBookingsByPracticeRef(res)
      if(bookings.length > 0) this.setBookings(bookings)
    })
  }
  private setBookings(bookings: Timestamp[]) {
    bookings.map(booking => {
      let newEvent = {
        title: 'RESERVADO',
        start: this.datePipe.transform(booking.seconds * 1000, "yyyy-MM-ddTHH:mm:ss"),
        end: this.datePipe.transform((booking.seconds+3600) * 1000, "yyyy-mm-ddTHH:mm:ss")
      }
      console.log(newEvent)
      this.practiceBookings.push(newEvent)
    })
    this.calendarOptions.events = this.practiceBookings
  }
}
