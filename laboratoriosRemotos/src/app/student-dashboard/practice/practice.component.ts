import { Subject } from 'src/app/models/Subject'
import { SubjectService } from 'src/app/services/subject.service';
import { Practice } from 'src/app/models/Practice';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeService } from 'src/app/services/practice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  constructor(private practiceSvc: PracticeService, private subjectSvc : SubjectService, private activatedRoute: ActivatedRoute) { }
  practiceSelected!: ObjectDB<Practice>
  subjectSelected!: ObjectDB<Subject>

  ngOnInit(): void {
    this.practiceSelected = this.activatedRoute.snapshot.data['practiceSelected']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']

  }

}