import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
  constructor(private authSvc: AuthService, private readonly router: Router){}
  canActivate(): Promise<boolean>{
    const pro = this.authSvc.isLogged().then(logged =>{
      if (!logged){
        this.router.navigate([''])
        return false
      }
      return true
    })
    return pro
  }
}
