import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { NavbarComponent } from "../compartido/navbar/NavbarComponent";
import { MaterialModule } from '../compartido/material.module';


@NgModule({
  declarations: [
    UserDashboardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    MaterialModule
  ]
})
export class UserDashboardModule { }
