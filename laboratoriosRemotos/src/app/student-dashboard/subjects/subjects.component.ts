import { Subject } from '../../models/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<Subject>[] = [];
  
  constructor(private userService: UserService, private subjectService: SubjectService,
    private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {

    this.subjects = this.activatedRoute.snapshot.data['subjects'];
  }

  goToPractices(subject:ObjectDB<Subject>){
    localStorage.setItem("subjectSelected",subject.getId())
    this.router.navigate(['../subject',subject.getId()], {relativeTo: this.activatedRoute})
  }
  goToDeleteSubject(){
    alert("Yendo a elimitar asignatura")
  }
}
