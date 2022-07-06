import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FullCalendarModule} from '@fullcalendar/angular'
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin  from '@fullcalendar/list';
import timeGridPlugin  from '@fullcalendar/timegrid';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin,
  listPlugin
])
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    FullCalendarModule
  ]
})
export class FullcalendarModule { }
