import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FormValidators } from 'src/app/models/FormValidators';

@Component({
  selector: 'app-schedule-practice',
  templateUrl: './schedule-practice.component.html',
  styleUrls: ['./schedule-practice.component.css']
})
export class SchedulePracticeComponent{

  @Input() endDate: string = '';
  noPrevDates = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const start = control.value
    if (start || start != '') {
      return moment(start).isSameOrBefore(this.endDate)
        ? null
        : { noPrevDates: true }
    }
    return null
  }
  start = new FormControl('', [Validators.required, FormValidators.noPrevDatesFromNow, this.noPrevDates]);

  getErrorMessage() {
    if (this.start.hasError('required')) {
      return 'Debes llenar el campo';
    } else if (this.start.hasError('noPrevDatesFromNow')) {
      return 'La fecha de inicio no puede ser antes de la fecha actual';
    }
    return this.start.hasError('noPrevDates') ? 'La fecha de inicio no puede ser despues de fecha de finalización' : '';
  }

}
