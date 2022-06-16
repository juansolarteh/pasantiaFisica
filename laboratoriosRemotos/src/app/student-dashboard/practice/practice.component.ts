import { Subject } from 'src/app/models/Subject'
import { SubjectService } from 'src/app/services/subject.service';
import { Practice } from 'src/app/models/Practice';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeService } from 'src/app/services/practice.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  constructor(private practiceSvc: PracticeService, private subjectSvc : SubjectService) { }
  practiceSelected!: ObjectDB<Practice>
  subjectSelected!: ObjectDB<Subject>

  ngOnInit(): void {
    this.practiceSelected = this.practiceSvc.getPracticeSelected()
    this.subjectSelected = this.subjectSvc.getSubjectSelected()
  }

}
