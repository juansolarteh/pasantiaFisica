import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Timestamp } from '@firebase/firestore';
import { PlantService } from '../services/plant.service';
import { ScheduleService } from '../services/schedule.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarResolver implements Resolve<Timestamp[]> {
  constructor(private scheduleSvc: ScheduleService, private plantSvc: PlantService) { }
  resolve(route: ActivatedRouteSnapshot): Promise<Timestamp[]> {
    const idPlant: string = route.paramMap.get('idPlant')!;
    let refPlant = this.plantSvc.getPlantRefFromId(idPlant);
    return this.scheduleSvc.getBookingsByPlantRef(refPlant)
  }
}
