import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { MaterialModule } from '../compartido/material.module';
import { ComponentesModule } from '../compartido/componentes/componentes.module';
import { SubjectComponent } from './subject/subject.component';


@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent
  ],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    MaterialModule,
    ComponentesModule
  ]
})
export class StudentDashboardModule { }
