import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FormValidators } from 'src/app/models/FormValidators';

@Component({
  selector: 'app-schedule-practice',
  templateUrl: './schedule-practice.component.html',
  styleUrls: ['./schedule-practice.component.css']
})
export class SchedulePracticeComponent implements OnInit {

  @Input() endDate: string = '';
  noPrevDates = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const start = control.value
    if (start || start != '') {
      console.log(this.endDate)
      return moment(start).isSameOrBefore(this.endDate)
        ? null
        : { noPrevDates: true }
    }
    return null
  }
  start = new FormControl('', [Validators.required, FormValidators.noPrevDatesFromNow, this.noPrevDates]);

  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.start.hasError('required')) {
      return 'Debes llenar el campo';
    } else if (this.start.hasError('noPrevDatesFromNow')) {
      return 'La fecha de publicación no puede ser antes de la fecha actual';
    }
    return this.start.hasError('noPrevDates') ? 'La fecha de publicación no puede ser despues de la fecha de finalización' : '';
  }

}
