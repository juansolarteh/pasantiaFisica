import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectTeacher } from '../models/SubjectTeacher';
import { SubjectService } from '../services/subject.service';

@Injectable({
  providedIn: 'root'
})
export class InfoSubjectResolver implements Resolve<SubjectTeacher> {

  constructor(private subjectSvc: SubjectService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SubjectTeacher> {
    const idSub: string = route.paramMap.get('subjectId')!;
    return this.subjectSvc.getSubjectById(idSub);
  }
}
