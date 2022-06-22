import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { MaterialModule } from '../shared/material.module';
import { UserListComponent } from './user-list/user-list.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ComponentsModule } from '../shared/components/components.module';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManagerDashboardComponent,
    UserListComponent,
    DeleteDialogComponent,
    AddDialogComponent,
  ],
  imports: [
    CommonModule,
    ManagerDashboardRoutingModule,
    MaterialModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class ManagerDashboardModule { }
