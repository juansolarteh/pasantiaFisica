import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-subject-button',
  template: '<button mat-icon-button matTooltip="Crear curso"><mat-icon>add</mat-icon></button>'
})
export class AddSubjectButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
