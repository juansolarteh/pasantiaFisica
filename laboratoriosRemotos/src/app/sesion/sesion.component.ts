import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseService } from '../models/ResponseService';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SesionComponent{

  constructor(private authService: AuthService, private readonly router: Router, private _snackBar: MatSnackBar) { }

  async login() {
    const response: ResponseService<void> = await this.authService.loginGoogle()
    if (response.isApproved()) {
      this.router.navigate(['../app'])
    }else{
      this.openSnackBar(response.getMessage())
    }
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }
}
