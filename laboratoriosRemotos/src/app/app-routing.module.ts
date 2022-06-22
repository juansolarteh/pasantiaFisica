import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CorrectPathGuard } from './guards/correct-path.guard';
import { LoggedGuard } from './guards/logged.guard';
import { PermissionNewSessionGuard } from './guards/permission-new-session.guard';

const routes: Routes = [
  { path: 'app', component: AppComponent, canActivate: [LoggedGuard], pathMatch: 'full'},
  {
    path: 'managerDashboard',
    loadChildren: () => import('./manager-dashboard/manager-dashboard.module').then(m => m.ManagerDashboardModule),
    canActivate: [LoggedGuard, CorrectPathGuard],
  },
  {
    path: 'teacherDashboard',
    loadChildren: () => import('./teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule),
    canActivate: [LoggedGuard, CorrectPathGuard],
  },
  {
    path: 'studentDashboard',
    loadChildren: () => import('./student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule),
    canActivate: [LoggedGuard, CorrectPathGuard],
  },
  {
    path: '',
    loadChildren: () => import('./sesion/sesion.module').then(m => m.SesionModule),
    canActivate: [PermissionNewSessionGuard],
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'app' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }