import { PracticaService } from './../../servicios/practica.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css']
})
export class PracticesComponent implements OnInit {

  constructor(private practiceService : PracticaService, private readonly router: Router, private activatedRoute: ActivatedRoute) { }
  subject_id !: string

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe(params=>{
      this.subject_id = params['subjectId']
      this.practiceService.getPracticesOfSubject(this.subject_id)
    })
    
    
    /* this.subject_id = this.activatedRoute.snapshot.paramMap.get('subjectId')!
    console.log("subjectid" , this.subject_id)
    this.practiceService.getPracticesOfSubject(this.subject_id)
    console.log(this.subject_id) */
  }

}
