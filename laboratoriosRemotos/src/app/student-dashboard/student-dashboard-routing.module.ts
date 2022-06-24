import { CurrentUserResolverService } from './../resolvers/student/current-user.resolver';
import { GroupStudentResolverService } from './../resolvers/student/group-student.resolver';
import { PracticeSelectedResolverService } from './../resolvers/student/practice-selected.resolver';
import { SubjectSelectedResolverService } from './../resolvers/student/subject-selected.resolver';
import { PracticesStudentResolverService } from './../resolvers/student/practices-student.resolver';
import { SubjectsStudentResolverService } from './../resolvers/student/subjects-student.resolver';
import { SubjectWithOutGroupResolverService } from '../resolvers/student/subject-without-group.resolver';
import { GroupsComponent } from './groups/groups.component';
import { PracticeComponent } from './practice/practice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectComponent } from './subject/subject.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { PracticesComponent } from './practices/practices.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [

  {
    path: 'subject/:subjectId', component: SubjectComponent,
    resolve: { subjectSelected: SubjectSelectedResolverService }, children: [
      {
        path: 'practice/:practiceId', component: PracticeComponent,
        resolve: {
          practiceSelected: PracticeSelectedResolverService,
          subjectSelected: SubjectSelectedResolverService
        }
      },
      {
        path: 'practices', component: PracticesComponent,
        resolve: {
          subjectSelected: SubjectSelectedResolverService,
          practices: PracticesStudentResolverService
        }
      },
      { path: 'calendar', component: CalendarComponent },
      {
        path: 'groups', component: GroupsComponent,
        resolve: {
          studentGroup: GroupStudentResolverService,
          studentsWithoutGroup: SubjectWithOutGroupResolverService,
          subjectSelected: SubjectSelectedResolverService,
          currentUser: CurrentUserResolverService
        }
      },
      { path: '', redirectTo: 'practices', pathMatch: 'full' },
    ]
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    pathMatch: 'full', resolve: {
      subjects: SubjectsStudentResolverService
    }
  },
  { path: '', redirectTo: 'subjects', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDashboardRoutingModule { }