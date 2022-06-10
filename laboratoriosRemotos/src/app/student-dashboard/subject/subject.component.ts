import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToInstance } from 'class-transformer';
import { Subject } from 'src/app/modelos/Subject';
import { PracticaService } from 'src/app/servicios/practica.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  constructor(private practiceService : PracticaService, private readonly router: Router, private activatedRoute: ActivatedRoute) { }
  selectedSubject!: Subject
  
  ngOnInit(): void {
    let subject = localStorage.getItem("selectedSubject")
    if (subject != null) {
      let aux = JSON.parse(subject) as Object
      this.selectedSubject = plainToInstance(Subject, aux)
    }
  }
  changeTab(event:any){
    console.log(event.index)
    switch(event.index){
      case 0: this.router.navigate(['./practices'], {relativeTo: this.activatedRoute});
      break;
      case 1: this.router.navigate(['./calendar'], {relativeTo: this.activatedRoute})
      break;
      case 2: this.router.navigate(['./groups'], {relativeTo: this.activatedRoute})
      break;
      default: this.router.navigate(['/'], {relativeTo: this.activatedRoute})
    }
  }

}
