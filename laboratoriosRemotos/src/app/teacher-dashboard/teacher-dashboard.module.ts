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
import { DeletePracticeDialogComponent } from './practices/delete-practice-dialog/delete-practice-dialog.component';
import { ModifyPracticeComponent } from './practices/modify-practice/modify-practice.component';
import { AddUpdateSubjectComponent } from './subjects/add-update-subject/add-update-subject.component';
import { DeleteSubjectComponent } from './subjects/delete-subject/delete-subject.component';
import { DeleteGroupDialogComponent } from './groups/delete-group-dialog/delete-group-dialog.component';
import { ConfirmDatesComponent } from './practices/modify-practice/confirm-dates/confirm-dates.component';
import { PracticeComponent } from './practice/practice.component';
import { IntructionsComponent } from './practice/intructions/intructions.component';
import { StudentPracticesComponent } from './practice/student-practices/student-practices.component';
import { PracticeExecutionComponent } from './practice-execution/practice-execution.component';

@NgModule({
  declarations: [
    SubjectsComponent,
    SubjectComponent,
    PracticesComponent,
    GroupsComponent,
    DeleteCourseMemberDialogComponent,
    AddPracticeFormComponent,
    SchedulePracticeComponent,
    DeletePracticeDialogComponent,
    ModifyPracticeComponent,
    AddUpdateSubjectComponent,
    DeleteSubjectComponent,
    DeleteGroupDialogComponent,
    ConfirmDatesComponent,
    PracticeComponent,
    IntructionsComponent,
    StudentPracticesComponent,
    PracticeExecutionComponent,
  ],
  imports: [
    CommonModule,
    TeacherDashboardRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule,
  ]
})
export class TeacherDashboardModule { }
