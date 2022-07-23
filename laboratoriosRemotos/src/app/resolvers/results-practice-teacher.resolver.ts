import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ObjectDB } from '../models/ObjectDB';
import { Results } from '../models/Results';
import { PracticeService } from '../services/practice.service';
import { ResultsService } from '../services/results.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsPracticeTeacherResolver implements Resolve<ObjectDB<Results>[]> {

  constructor(private practiceSvc: PracticeService, private resultSvc: ResultsService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ObjectDB<Results>[]> {
    const idPrac: string = route.parent?.paramMap.get('practiceid')!;
    const practiceRef = await this.practiceSvc.getRefByPracticeId(idPrac);
    return await this.resultSvc.getFilesByPracticeRef(practiceRef);
  }
}
