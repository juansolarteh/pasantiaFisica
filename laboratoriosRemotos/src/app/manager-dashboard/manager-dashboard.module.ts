import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { MaterialModule } from '../compartido/material.module';
import { CompartidoModule } from '../compartido/compartido/compartido.module';


@NgModule({
  declarations: [
    ManagerDashboardComponent,
  ],
  imports: [
    CommonModule,
    ManagerDashboardRoutingModule,
    MaterialModule,
    CompartidoModule
  ]
})
export class ManagerDashboardModule { }
