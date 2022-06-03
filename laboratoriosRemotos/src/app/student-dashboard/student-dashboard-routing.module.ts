import { GroupsComponent } from './groups/groups.component';
import { PracticeComponent } from './practice/practice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectPathGuard } from '../guards/correct-path.guard';
import { SubjectComponent } from './subject/subject.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { PracticesComponent } from './practices/practices.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  
  { path: 'subject/:subjectId', component: SubjectComponent, canActivate: [CorrectPathGuard],children : [
    {path: 'practice/:practiceId', component: PracticeComponent},
    { path: 'practices', component: PracticesComponent},
    { path: 'calendar', component: CalendarComponent},
    { path: 'groups', component: GroupsComponent},
    { path: '', redirectTo: 'practices', pathMatch: 'full'},
  ]},
  { path: 'subjects', component: SubjectsComponent, pathMatch: 'full', canActivate: [CorrectPathGuard] },
  { path: '', redirectTo: 'subjects', pathMatch: 'full', canActivate: [CorrectPathGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }
