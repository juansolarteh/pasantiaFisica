import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SesionComponent{

  constructor(private authService: AuthService, private readonly router: Router, private _snackBar: MatSnackBar) { }

  async login() {
    const response = await this.authService.loginGoogle()
    if (response.approved) {
      this.router.navigate([''])
    }
    this.openSnackBar(response.message)
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }

  renderizado(){
    console.log("render login")
    return true
  }
}
