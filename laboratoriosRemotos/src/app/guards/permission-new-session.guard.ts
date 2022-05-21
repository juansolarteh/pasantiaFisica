import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionNewSessionGuard implements CanActivate {
  constructor(private authSvc: AuthService, private readonly router: Router){}
  canActivate(): Promise<boolean>{
    const pro = this.authSvc.isLogged().then(logged =>{
      if (logged){
        this.router.navigate(['app'])
        return false
      }
      return true
    })
    return pro
  }
  
}
