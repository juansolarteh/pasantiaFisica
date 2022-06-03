
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/NavbarComponent';
import { MaterialModule } from '../material.module';
import { CardSubjectComponent } from './card-subject/card-subject.component';



@NgModule({
  declarations: [
    NavbarComponent,
    CardSubjectComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    NavbarComponent,
    CardSubjectComponent
  ]
})
export class ComponentesModule { }
