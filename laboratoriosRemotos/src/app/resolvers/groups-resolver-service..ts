import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CursoService } from '../servicios/curso.service';
import { GruposService } from '../servicios/grupos.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<any[]> {
  constructor(private subjectSvc: CursoService, private grupoSvc: GruposService) { }
  resolve(): any[] | Observable<any[]> | Promise<any[]> {
    console.log('desde resolver => ', this.subjectSvc.subjectSelectedRef)
    return this.grupoSvc.getFromSubjectRef(this.subjectSvc.subjectSelectedRef)
  }
}
