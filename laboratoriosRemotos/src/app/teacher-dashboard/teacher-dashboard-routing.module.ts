import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsResolverServiceResolver } from '../resolvers/groups-resolver-service.';
import { InfoSubjectResolver } from '../resolvers/info-subject.resolver';
import { PracticeResolver } from '../resolvers/practice.resolver';
import { PracticesResolverServiceResolver } from '../resolvers/practices-resolver-service.resolver';
import { SubjectsTeacherResolverServiceResolver } from '../resolvers/subjects-teacher-resolver-service.resolver';
import { WithoutGroupResolverServiceResolver } from '../resolvers/without-group-resolver-service.resolver';
import { GroupsComponent } from './groups/groups.component';
import { PracticeComponent } from './practice/practice.component';
import { PracticesComponent } from './practices/practices.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectsComponent } from './subjects/subjects.component';

const routes: Routes = [
  {
    path: 'subject/:subjectId',
    component: SubjectComponent,
    resolve: { subject: InfoSubjectResolver },
    children: [
      {
        path: 'p',
        pathMatch: 'full',
        component: PracticesComponent,
        resolve: { practices: PracticesResolverServiceResolver }
      },
      {
        path: 'g',
        pathMatch: 'full',
        component: GroupsComponent,
        resolve: {
          groups: GroupsResolverServiceResolver,
          withoutGroup: WithoutGroupResolverServiceResolver
        },
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
  {
    path: 'practice/:practiceid',
    pathMatch: 'full',
    component: PracticeComponent,
    resolve: { practice: PracticeResolver }
  },
  { path: '**', redirectTo: 'subjects', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDashboardRoutingModule { }
