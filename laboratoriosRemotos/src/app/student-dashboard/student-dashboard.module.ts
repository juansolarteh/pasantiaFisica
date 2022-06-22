import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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


@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    PracticeComponent,
    GroupsComponent,
    CodeSubjectCardComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    MaterialModule,
    ComponentsModule
  ]
})
export class StudentDashboardModule { }
