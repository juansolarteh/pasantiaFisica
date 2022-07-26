import { PracticeExecutionStudentResolver } from './../resolvers/student/practice-execution-student.resolver';
import { PracticeExecutionComponent } from './practice-execution/practice-execution.component'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component : PracticeExecutionComponent,
    
    pathMatch: 'full'

  },
  {
    path: '**', redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeExecutionRoutingModule { }
