import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CorrectPathGuard implements CanActivate {

  constructor(private readonly router: Router, private authService: AuthService, private userSvc: UserService) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const emailUser: string | null = localStorage.getItem('email');
    if (emailUser == null) {
      this.authService.logout();
      this.router.navigate(['/']);
      return false;
    }

    const resp = this.userSvc.defineRol(emailUser).then(() => {
      const route = state.url;
      const rol = localStorage.getItem('rol');
      if (route == '/app') {
        return true;
      } else {
        const fw = route.split('/')[1];
        if (rol === 'Docente' && fw === 'teacherDashboard') {
          return true;
        } else if (rol === 'Estudiante' && fw === 'studentDashboard') {
          return true;
        } else if ((rol === 'Laboratorista' || rol === 'Jefe departamento') && fw === 'managerDashboard') {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    })
    return resp;
  }

}
