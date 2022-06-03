import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { MaterialModule } from '../compartido/material.module';
import { ComponentesModule } from '../compartido/componentes/componentes.module';
import { SubjectComponent } from './subject/subject.component';

import { GroupsComponent } from './subject/groups/groups.component';
import { PracticesComponent } from './practices/practices.component';
import { PracticeComponent } from './practice/practice.component';


@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    PracticeComponent,
    GroupsComponent,
  ],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    MaterialModule,
    ComponentesModule
  ]
})
export class StudentDashboardModule { }
