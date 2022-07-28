import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { PracticeExecution } from '../models/PracticeExecution';
import { PlantService } from '../services/plant.service';

@Injectable({
  providedIn: 'root'
})
export class PlantExecutionResolver implements Resolve<PracticeExecution> {

  constructor(private plantSvc: PlantService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PracticeExecution> {
    localStorage.removeItem('approved_navigation')
    const idPlant: string = route.paramMap.get('idPlant')!;
    let refPlant = this.plantSvc.getPlantRefFromId(idPlant)
    return this.plantSvc.getPlant(refPlant).then(plant => {
      return this.plantSvc.getConstantsDB(idPlant).then(constants => {
        let practiceExecution : PracticeExecution = {
          id: idPlant,
          plantName : plant.getNombre(),
          range: plant.getRango(),
          units : plant.getUnidades(),
          constants : constants
        }
        return practiceExecution
      })
    })
  }

  aa(){
    return 2
  }
}
