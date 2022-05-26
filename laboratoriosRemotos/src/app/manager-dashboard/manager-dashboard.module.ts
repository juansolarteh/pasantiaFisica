import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { MaterialModule } from '../compartido/material.module';
import { PersonListComponent } from './person-list/person-list.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ComponentesModule } from '../compartido/componentes/componentes.module';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManagerDashboardComponent,
    PersonListComponent,
    DeleteDialogComponent,
    AddDialogComponent,
  ],
  imports: [
    CommonModule,
    ManagerDashboardRoutingModule,
    MaterialModule,
    ComponentesModule,
    ReactiveFormsModule
  ]
})
export class ManagerDashboardModule { }
