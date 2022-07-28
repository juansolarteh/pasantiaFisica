import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PlantService } from 'src/app/services/plant.service';

@Injectable({
  providedIn: 'root'
})
export class NamePlantsResolver implements Resolve<ObjectDB<string>[]> {

  constructor(private plantSvc: PlantService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ObjectDB<string>[]> {
    return this.plantSvc.getNamePlants();
  }
}
