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

  constructor(private practiceService: PracticeService, private cursoService: SubjectService, private readonly router: Router
    , private activatedRoute: ActivatedRoute) { }
  subject_id !: string
  practices: Practice[] = []
  selectedSubject!: Subject

  ngOnInit(): void {
    let subject = localStorage.getItem("selectedSubject")
    if (subject != null) {
      let aux = JSON.parse(subject) as Object
      this.selectedSubject = plainToInstance(Subject, aux)
    }
    let refSubject = this.cursoService.getSubject(this.selectedSubject.getSubjectId())
    /* this.practiceService.getPractices(refSubject).then(res => {
      this.practices = res
      console.log(this.practices)
    }) */
  }
  goToPracticeInfo(practice: Practice) {
    alert("hola")
  }
}
