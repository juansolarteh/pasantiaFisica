import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerResolverService } from '../resolvers/manager-resolver-service';
import { ManagerDashboardComponent } from './manager-dashboard.component';

const routes: Routes = [
  { 
    path: '', 
    component: ManagerDashboardComponent,
    resolve: { users: ManagerResolverService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerDashboardRoutingModule { }
