import { Injectable } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {

  constructor() { }

  todayOrBeforeOf(ts: Timestamp, beforeOf: number){
    let date = moment(ts.toDate())
    let today = moment();
    if(date.isBefore(today)){
      return false;
    }else if(date.diff(today, 'days') > beforeOf){
      return false
    }
    return true;
  }
}
