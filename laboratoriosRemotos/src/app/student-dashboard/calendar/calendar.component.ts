import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor() { }
  
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
      timeGridWeek: { buttonText: 'Semana'},
      timeGridDay: { buttonText: 'Día'},
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
  }

  handleDateClick(arg : any) {
    alert("click")
  }

}
