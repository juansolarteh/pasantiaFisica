import { Subject } from '../../models/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<Subject>[] = [];
  
  constructor( private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.subjects = this.activatedRoute.snapshot.data['subjects'];
    console.log(this.subjects)
  }

  goToPractices(subject:ObjectDB<Subject>){
    alert("hola")
    //localStorage.setItem("selectedSubject" , JSON.stringify(subject))
    //this.router.navigate(['../subject',subject.getSubjectId()], {relativeTo: this.activatedRoute})
  }
  goToDeleteSubject(){
    alert("Yendo a elimitar asignatura")
  }
}
