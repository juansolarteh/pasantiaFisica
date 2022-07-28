import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsedPlantGuard implements CanActivate {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private db: AngularFireDatabase) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idPlant: string = route.paramMap.get('idPlant')!;
    const dbref = ref(getDatabase());
    let flag = false
    return get(child(dbref, "Stream" + idPlant)).then(async (snapshot) => {
      let estado: number = snapshot.val().estado;
      if (estado === 1) {
        this.router.navigate(['/'], { relativeTo: this.activatedRoute })
        return false
      } else {
        let plantRef: AngularFireObject<any>
        plantRef = this.db.object("/Stream" + idPlant)
        return await plantRef.update({estado: 1}).then(() => { return true });
      }
    });
  }
}
