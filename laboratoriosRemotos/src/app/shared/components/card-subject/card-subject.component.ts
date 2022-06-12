import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-subject',
  templateUrl: './card-subject.component.html',
  styleUrls: ['./card-subject.component.css']
})
export class CardSubjectComponent implements OnInit {
  
  @Input() subjectTitle: string = ""
  constructor() { }

  ngOnInit(): void {
  }

}
