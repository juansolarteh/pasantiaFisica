import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-department-head',
  templateUrl: './change-department-head.component.html',
  styleUrls: ['./change-department-head.component.css']
})
export class ChangeDepartmentHeadComponent{

  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern(('[^]*(unicauca.edu.co)'))]);

  constructor(private userSvc: UserService, private _snackBar: MatSnackBar) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes llenar el campo';
    }
    if (this.email.hasError('email')) {
      return 'No es un email valido';
    }
    return this.email.hasError('pattern') ? 'El dominio debe pertenecer a Unicauca' : '';
  }

  onChangeRol() {
    console.log('aaaa')
    
  }
  
  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000);
  }

}
