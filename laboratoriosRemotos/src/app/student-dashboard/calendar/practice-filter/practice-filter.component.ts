import { ObjectDB } from 'src/app/models/ObjectDB';
import { Component, EventEmitter, Input, Output, AfterContentInit } from '@angular/core';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-practice-filter',
  templateUrl: './practice-filter.component.html',
  styleUrls: ['./practice-filter.component.css']
})
export class PracticeFilterComponent {

  @Input() practices: ObjectDB<Practice>[] = [];
  @Output() onPracticeSelected = new EventEmitter<ObjectDB<Practice>>();
  practiceSelected!: ObjectDB<Practice>
  
  constructor() { }

  onPracticeChange(practice:ObjectDB<Practice>[]){
    this.onPracticeSelected.emit(practice[0])
  }
}
