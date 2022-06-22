import { Subject } from '../../models/Subject';
import { SubjectService } from 'src/app/services/subject.service';
import { PracticeService } from '../../services/practice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Practice } from 'src/app/models/Practice';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit {

  constructor(private practiceService: PracticeService, private cursoService: SubjectService, private readonly router: Router
    , private activatedRoute: ActivatedRoute) { }
  subject_id !: string
  practices: Practice[] = []
  selectedSubject!: Subject

  ngOnInit(): void {
    this.selectedSubject = this.activatedRoute.snapshot.data['subjectSelected']
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }
  goToPracticeInfo(practice: ObjectDB<Practice>) {
    localStorage.setItem("practiceSelected", practice.getId())
    this.router.navigate(['../practice',practice.getId()], {relativeTo: this.activatedRoute})
  }
}
