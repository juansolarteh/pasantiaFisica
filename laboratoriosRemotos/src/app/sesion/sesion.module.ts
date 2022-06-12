import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SesionRoutingModule } from './sesion-routing.module';
import { SesionComponent } from './sesion.component';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [
    SesionComponent
  ],
  imports: [
    CommonModule,
    SesionRoutingModule,
    MaterialModule
  ]
})
export class SesionModule { }
