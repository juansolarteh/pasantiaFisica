import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ObjectDB } from '../models/ObjectDB';
import { Practice } from '../models/Practice';
import { PracticeService } from '../services/practice.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeResolver implements Resolve<ObjectDB<Practice>> {

  constructor(private practiceSvc: PracticeService){}

  resolve(route: ActivatedRouteSnapshot): Promise<ObjectDB<Practice>> {
    const idPrac: string = route.paramMap.get('practiceid')!;
    return this.practiceSvc.getPracticeById(idPrac);
  }
}
