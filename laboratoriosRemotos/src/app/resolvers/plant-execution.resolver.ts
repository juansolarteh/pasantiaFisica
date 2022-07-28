import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantExecutionResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const idPlant: string = route.paramMap.get('idPlant')!;
    ///Aca deberia preguntar por la correspondiente planta
    //Por ahora solo conecta con la de streamCaidaLibre

  /*   const dbref = ref(getDatabase());
    get(child(dbref, "StreamCaidaLibre"))
      .then((snapshot) => {
        console.log(snapshot.val().estado);
        if (snapshot.val().estado == 0) {
          set(ref(getDatabase(), 'StreamCaidaLibre'), {
            estado: 1,
            url: snapshot.val().url,
            cerrar: 0
          });
        }
      });
      setTimeout(this.navigateToPracticeExecution.bind(this),2000)


    
    const dbref = ref(getDatabase());
    get(child(dbref, "StreamCaidaLibre")).then((snapshot) => {
      let estado: number = snapshot.val().estado;
      if (estado === 1) {
        this.router.navigate(['/'], { relativeTo: this.activatedRoute })
        return false
      }
      return true
    }); */
    return of(true);
  }
}
