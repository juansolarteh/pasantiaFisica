import { Subject } from '../../models/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: Subject[] = [];
  
  constructor(private userService: UserService, private subjectService: SubjectService,
    private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.subjects = this.activatedRoute.snapshot.data['subjects'];
    console.log(this.subjects)
  }

  /* goToPractices(subject: Subject){
    localStorage.setItem("selectedSubject" , JSON.stringify(subject))
    //this.router.navigate(['../subject',subject.getSubjectId()], {relativeTo: this.activatedRoute})
  } */
  goToDeleteSubject(){
    alert("Yendo a elimitar asignatura")
  }
}
