import { Subject } from './../../modelos/Subject';
import { CursoService } from 'src/app/servicios/curso.service';
import { PracticaService } from './../../servicios/practica.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit {

  constructor(private practiceService: PracticaService, private cursoService: CursoService, private readonly router: Router, private activatedRoute: ActivatedRoute) { }
  subject_id !: string
  practices: any[] = []
  selectedSubject!: Subject

  ngOnInit(): void {
    let subject = localStorage.getItem("selectedSubject")
    if (subject != null) {
      let aux = JSON.parse(subject) as Object
      this.selectedSubject = plainToInstance(Subject, aux)
    }
    /* let refSubject = this.cursoService.getSubject(this.selectedSubject.getSubjectId())
    this.practiceService.getPractices(refSubject).then(res => {
      this.practices = res
    }) */
  }
}
