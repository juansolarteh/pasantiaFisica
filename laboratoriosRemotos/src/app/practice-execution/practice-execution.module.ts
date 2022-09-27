import { PracticeExecutionComponent } from './practice-execution/practice-execution.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticeExecutionRoutingModule } from './practice-execution-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ReportAnomalyComponent } from './report-anomaly/report-anomaly.component';


@NgModule({
  declarations: [
    PracticeExecutionComponent,
    ReportAnomalyComponent
  ],
  imports: [
    CommonModule,
    PracticeExecutionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class PracticeExecutionModule { }
