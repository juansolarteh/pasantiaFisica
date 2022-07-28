import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidPlantGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let navigation = localStorage.getItem('approved_navigation')
    console.log('esto es => ', navigation)
    if (navigation) {
      return true
    }
    const idPlant: string = route.paramMap.get('idPlant')!;
    this.router.navigate(['teacherDashboard/calendarPlant', idPlant]);
    return false;
  }

}
