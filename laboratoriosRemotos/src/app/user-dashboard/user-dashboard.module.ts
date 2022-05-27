import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { MaterialModule } from '../compartido/material.module';
import { TabDocenteComponent } from './docente/tab-docente/tab-docente.component';
import { TabEstudianteComponent } from './estudiante/tab-estudiante/tab-estudiante.component';
import { ComponentesModule } from '../compartido/componentes/componentes.module';
import { AddSubjectButtonComponent } from './docente/add-subject-button/add-subject-button.component';


@NgModule({
  declarations: [
    UserDashboardComponent,
    TabDocenteComponent,
    TabEstudianteComponent,
    AddSubjectButtonComponent,
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    MaterialModule,
    ComponentesModule
  ]
})
export class UserDashboardModule { }
