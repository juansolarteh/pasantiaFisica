import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { CardSubjectComponent } from './card-subject/card-subject.component';
import { NavbarComponent } from './navbar/navbarComponent';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    NavbarComponent,
    CardSubjectComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSidenavModule,
  ],
  exports: [
    NavbarComponent,
    CardSubjectComponent,
  ]
})
export class ComponentsModule { }
