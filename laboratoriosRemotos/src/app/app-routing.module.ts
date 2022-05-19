import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'sesion', loadChildren: () => import('./sesion/sesion.module').then(m => m.SesionModule) },
  { path: 'userDashboard', loadChildren: () => import('./user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule) },
  { path: 'managerDashboard', loadChildren: () => import('./manager-dashboard/manager-dashboard.module').then(m => m.ManagerDashboardModule) },
  { path: '**', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }