import { ObjectDB } from './../../models/ObjectDB';
import { Subject } from '../../models/Subject';
import { SubjectService } from 'src/app/services/subject.service';
import { PracticeService } from '../../services/practice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit {

  constructor(private practiceSvc: PracticeService,
    private subjectSvc: SubjectService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute) { }

  practices: ObjectDB<Practice>[] = []
  subjectSelected!: ObjectDB<Subject>

  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
    this.subjectSelected = this.subjectSvc.getSubjectSelected()
    console.log(this.practices)
  }
  goToPracticeInfo(practice: ObjectDB<Practice>) {
    this.practiceSvc.setPracticeSelected(practice)
    this.router.navigate(['../practice',practice.getId()], {relativeTo: this.activatedRoute})
  }
}
