import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoggedGuard } from './guards/logged.guard';
import { PermissionNewSessionGuard } from './guards/permission-new-session.guard';
import { WorkersResolverService } from './resolvers/workers-resolver-service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./sesion/sesion.module').then(m => m.SesionModule),
    canActivate: [PermissionNewSessionGuard]
  },
  { path: 'app', component: AppComponent, canActivate: [LoggedGuard] },
  {
    path: 'managerDashboard',
    loadChildren: () => import('./manager-dashboard/manager-dashboard.module').then(m => m.ManagerDashboardModule),
    canActivate: [LoggedGuard],
    resolve: { workers: WorkersResolverService}
  },
  {
    path: 'userDashboard',
    loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule),
    canActivate: [LoggedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }