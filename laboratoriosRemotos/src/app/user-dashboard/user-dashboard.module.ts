import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { MaterialModule } from '../compartido/material.module';
import { CompartidoModule } from '../compartido/compartido/compartido.module';
import { TabDocenteComponent } from './docente/tab-docente/tab-docente.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    TabDocenteComponent,
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    MaterialModule,
    CompartidoModule
  ]
})
export class UserDashboardModule { }
