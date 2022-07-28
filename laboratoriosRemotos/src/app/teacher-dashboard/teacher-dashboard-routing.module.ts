import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsedPlantGuard } from '../guards/used-plant.guard';
import { GroupsResolverServiceResolver } from '../resolvers/groups-resolver-service.';
import { InfoSubjectResolver } from '../resolvers/info-subject.resolver';
import { NameSubjectsResolver } from '../resolvers/sideBar/name-subjects.resolver';
import { PlantExecutionResolver } from '../resolvers/plant-execution.resolver';
import { PracticeGroupsResolver } from '../resolvers/practice-groups.resolver';
import { PracticeResolver } from '../resolvers/practice.resolver';
import { PracticesResolverServiceResolver } from '../resolvers/practices-resolver-service.resolver';
import { ResultsPracticeTeacherResolver } from '../resolvers/results-practice-teacher.resolver';
import { SubjectsTeacherResolverServiceResolver } from '../resolvers/subjects-teacher-resolver-service.resolver';
import { UniqueGroupResolver } from '../resolvers/unique-group.resolver';
import { WithoutGroupResolverServiceResolver } from '../resolvers/without-group-resolver-service.resolver';
import { GroupsComponent } from './groups/groups.component';
import { PracticeTeacherExecutionComponent } from './practice-teacher-execution/practice-execution.component';
import { IntructionsComponent } from './practice/intructions/intructions.component';
import { PracticeComponent } from './practice/practice.component';
import { StudentPracticesComponent } from './practice/student-practices/student-practices.component';
import { PracticesComponent } from './practices/practices.component';
import { SubjectComponent } from './subject/subject.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { NamePlantsResolver } from '../resolvers/sideBar/name-plants.resolver';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarResolver } from '../resolvers/calendar.resolver';

const routes: Routes = [
  {
    path: '',
    component: TeacherDashboardComponent,
    resolve: {
      subjectNames: NameSubjectsResolver,
      plantNames: NamePlantsResolver
    },
    children: [
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
          { path: '**', redirectTo: 'p' },
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
        component: PracticeComponent,
        children: [
          {
            path: 'i',
            pathMatch: 'full',
            component: IntructionsComponent,
            resolve: { practice: PracticeResolver }
          },
          {
            path: 'p',
            pathMatch: 'full',
            component: StudentPracticesComponent,
            resolve: {
              groups: PracticeGroupsResolver,
              results: ResultsPracticeTeacherResolver
            }
          },
          { path: '**', redirectTo: 'p' },
        ]
      },
      {
        path: 'pracExec/:groupid',
        component: PracticeTeacherExecutionComponent,
        resolve: {
          group: UniqueGroupResolver
        },
      },
      {
        path: 'plantasdasdasdsad/:idPlant',
        loadChildren: () => import('../practice-execution/practice-execution.module').then(m => m.PracticeExecutionModule),
        canActivate: [UsedPlantGuard],
        resolve: {
          practiceExecution: PlantExecutionResolver
        }
      },
      {
        path: 'calendarPlant/:idPlant',
        component: CalendarComponent,
        resolve: {
         calendar: CalendarResolver
        }
      },
      { path: '**', redirectTo: 'subjects' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDashboardRoutingModule { }
