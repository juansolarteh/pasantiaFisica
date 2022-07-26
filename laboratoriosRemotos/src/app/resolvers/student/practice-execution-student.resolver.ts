import { PracticeExecution } from './../../models/PracticeExecution';
import { PracticeService } from 'src/app/services/practice.service';
import { PlantService } from 'src/app/services/plant.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeExecutionStudentResolver implements Resolve<PracticeExecution> {
  constructor(private plantSvc : PlantService, private practiceSvc : PracticeService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PracticeExecution> {
    const idPrac: string = route.paramMap.get('practiceId')!;
    return this.practiceSvc.getPracticeById(idPrac).then(practice=>{
      return this.plantSvc.getPlant(practice.getObjectDB().getPlanta()).then(plant=>{
        return this.practiceSvc.getConstantsPractice(idPrac).then(constants=>{
          let practiceExecution : PracticeExecution = {
            plantName : plant.getNombre(),
            range: plant.getRango(),
            units : plant.getUnidades(),
            constants : constants
          }
          return practiceExecution
        })
      })
    })
  }
}
