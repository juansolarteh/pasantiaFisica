import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsedPlantGuard implements CanActivate {

  constructor(private router: Router, private activatedRoute: ActivatedRoute){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idPlant: string = route.paramMap.get('idPlant')!;
    ///Aca deberia preguntar por la correspondiente planta
    //Por ahora solo conecta con la de streamCaidaLibre
    const dbref = ref(getDatabase());
    return get(child(dbref, "StreamCaidaLibre")).then((snapshot) => {
      let estado: number = snapshot.val().estado;
      if (estado === 1) {
        this.router.navigate(['/'], { relativeTo: this.activatedRoute })
        return false
      }
      return true
    });
  }

}
