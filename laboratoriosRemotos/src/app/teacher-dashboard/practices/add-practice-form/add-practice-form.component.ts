import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-practice-form',
  templateUrl: './add-practice-form.component.html',
  styleUrls: ['./add-practice-form.component.css']
})
export class AddPracticeFormComponent implements OnInit {

  name = new FormControl('', [Validators.required, Validators.maxLength(30)]);

  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Debes llenar el campo';
    }
    return this.name.hasError('maxlength') ? 'En nombre no puede superar los 30 caracteres' : '';
  }
}
