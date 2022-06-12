import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectPathGuard } from '../guards/correct-path.guard';
import { GroupsResolverServiceResolver } from '../resolvers/groups-resolver-service.';
import { SubjectsTeacherResolverServiceResolver } from '../resolvers/subjects-teacher-resolver-service.resolver';
import { GroupsComponent } from './groups/groups.component';
import { PracticesComponent } from './practices/practices.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectsComponent } from './subjects/subjects.component';

const routes: Routes = [
  {
    path: 'subject/:subjectId', component: SubjectComponent, children: [
      { path: 'p', component: PracticesComponent, },
      {
        path: 'g',
        component: GroupsComponent,
        resolve: { groups: GroupsResolverServiceResolver },
      },
      { path: '', redirectTo: 'p', pathMatch: 'full' },
    ]
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    pathMatch: 'full',
    resolve: { subjects: SubjectsTeacherResolverServiceResolver }
  },
  { path: '', redirectTo: 'subjects', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDashboardRoutingModule { }
