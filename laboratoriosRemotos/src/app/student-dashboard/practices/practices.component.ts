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
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }
  goToPracticeInfo(practice: ObjectDB<Practice>) {
    localStorage.setItem("practiceSelected", practice.getId())
    this.router.navigate(['../practice',practice.getId()], {relativeTo: this.activatedRoute})
  }
}
