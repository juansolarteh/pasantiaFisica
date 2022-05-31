import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { ComponentesModule } from '../compartido/componentes/componentes.module';
import { MaterialModule } from '../compartido/material.module';
import { SubjectComponent } from './subject/subject.component';
import { PracticesComponent } from './practices/practices.component';
import { GroupsComponent } from './groups/groups.component';
import { DeleteCourseMemberDialogComponent } from './groups/delete-course-member-dialog/delete-course-member-dialog.component';

@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    GroupsComponent,
    DeleteCourseMemberDialogComponent
  ],
  imports: [
    CommonModule,
    TeacherDashboardRoutingModule,
    MaterialModule,
    ComponentesModule
  ]
})
export class TeacherDashboardModule { }
