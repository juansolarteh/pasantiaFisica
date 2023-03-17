import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  practicasSelected = true;
  gruposSelected = false;
  constructor() { }
}
