import { CalendarStudentResolver } from './../resolvers/student/calendar-student.resolver';
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
import { PracticeExecutionStudentResolver } from '../resolvers/student/practice-execution-student.resolver';

const routes: Routes = [

  {
    path: 'subject/:subjectId', component: SubjectComponent,
    resolve: { subjectSelected: SubjectSelectedResolverService, subjects: SubjectsStudentResolverService }, children: [
      {
        path: 'practice/:practiceId', component: PracticeComponent,
        resolve: {
          practiceSelected: PracticeSelectedResolverService,
          subjectSelected: SubjectSelectedResolverService,
          plantValidation : CalendarStudentResolver,
          studentGroup : GroupStudentResolverService
        }
          
      },
      {
        path: 'calendar/:practiceId', component: CalendarComponent,
        resolve: {
          subjectSelected: SubjectSelectedResolverService,
          practiceSelected: PracticeSelectedResolverService,
          studentGroup: GroupStudentResolverService
        }
      },
      {
        path: 'practice-execution/:practiceId',
        loadChildren: () => import('../practice-execution/practice-execution.module').then(m => m.PracticeExecutionModule),
        resolve: {
          subjectSelected: SubjectSelectedResolverService,
          practiceSelected: PracticeSelectedResolverService,
          studentGroup: GroupStudentResolverService,
          practiceExecution: PracticeExecutionStudentResolver
        },
      },
      {
        path: 'practices', component: PracticesComponent,
        resolve: {
          subjectSelected: SubjectSelectedResolverService,
          practices: PracticesStudentResolverService
        }
      },

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