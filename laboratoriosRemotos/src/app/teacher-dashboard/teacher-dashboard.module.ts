import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { ComponentsModule } from '../shared/components/components.module';
import { MaterialModule } from '../shared/material.module';
import { SubjectComponent } from './subject/subject.component';
import { PracticesComponent } from './practices/practices.component';
import { GroupsComponent } from './groups/groups.component';
import { DeleteCourseMemberDialogComponent } from './groups/delete-course-member-dialog/delete-course-member-dialog.component';
import { AddPracticeFormComponent } from './practices/add-practice-form/add-practice-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedulePracticeComponent } from './practices/add-practice-form/schedule-practice/schedule-practice.component';

@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    GroupsComponent,
    DeleteCourseMemberDialogComponent,
    AddPracticeFormComponent,
    SchedulePracticeComponent
  ],
  imports: [
    CommonModule,
    TeacherDashboardRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class TeacherDashboardModule { }
