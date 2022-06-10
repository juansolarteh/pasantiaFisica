import { CursoService } from 'src/app/servicios/curso.service';
import { PracticaService } from './../../servicios/practica.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit {

  constructor(private practiceService : PracticaService, private cursoService : CursoService, private readonly router: Router, private activatedRoute: ActivatedRoute) { }
  subject_id !: string
  practices : any[] = []

  ngOnInit(): void {

    this.activatedRoute.parent?.params.subscribe(params=>{
      this.subject_id = params['subjectId']
    })

    let refSubjetct = this.cursoService.getSubject(this.subject_id)
    this.practiceService.getPractices(refSubjetct).then(res => {
      this.practices = res
    })
  }

}
