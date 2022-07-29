import { FullcalendarModule } from './../shared/fullcalendar.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { MaterialModule } from '../shared/material.module';
import { ComponentsModule } from '../shared/components/components.module';
import { SubjectComponent } from './subject/subject.component';
import { GroupsComponent } from './groups/groups.component';
import { PracticesComponent } from './practices/practices.component';
import { PracticeComponent } from './practice/practice.component';
import { CodeSubjectCardComponent } from './subjects/code-subject-card/code-subject-card.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from './groups/dialog/dialog.component';
import { StudentsWithoutGroupComponent } from './groups/students-without-group/students-without-group.component';
import { CheckBookingDialogComponent } from './calendar/check-booking-dialog/check-booking-dialog.component';
import { ChangeBookingDialogComponent } from './calendar/change-booking-dialog/change-booking-dialog.component';


@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    PracticeComponent,
    GroupsComponent,
    CodeSubjectCardComponent,
    CalendarComponent,
    DialogComponent,
    StudentsWithoutGroupComponent,
    CheckBookingDialogComponent,
    ChangeBookingDialogComponent,
  ],
  entryComponents: [DialogComponent,CheckBookingDialogComponent],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    MaterialModule,
    ComponentsModule,
    FormsModule,
    FullcalendarModule,
    ReactiveFormsModule
  ],
  providers:[
    DatePipe
  ]
})
export class StudentDashboardModule { }