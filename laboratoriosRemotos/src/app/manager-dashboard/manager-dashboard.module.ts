import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { ManagerDashboardComponent } from './manager-dashboard.component';


@NgModule({
  declarations: [
    ManagerDashboardComponent
  ],
  imports: [
    CommonModule,
    ManagerDashboardRoutingModule
  ]
})
export class ManagerDashboardModule { }
