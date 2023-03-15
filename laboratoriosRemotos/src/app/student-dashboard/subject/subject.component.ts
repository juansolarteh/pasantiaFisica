import { AuthService } from 'src/app/services/auth.service';
import { PracticeService } from './../../services/practice.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Subject } from 'src/app/models/Subject';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute, private authService : AuthService) { }
  subjectSelected!: ObjectDB<Subject>
  subjects: ObjectDB<Subject>[];

  ngOnInit(): void {
    //this.activeLink = this.links[0];
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.subjects = this.activatedRoute.snapshot.data['subjects'];
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
  }

  goToSubjectTopBar(subject:ObjectDB<Subject>){
    localStorage.setItem("subjectSelected",subject.getId())
    this.router.navigateByUrl(`studentDashboard/subject/${subject.getId()}`)
  }
  
  goToPractices(){
    this.router.navigate(['./practices'], {relativeTo: this.activatedRoute});
  }

  goToGroups(){
    this.router.navigate(['./groups'], {relativeTo: this.activatedRoute})
  }

  logOut(){
    this.authService.logout().then(res => {
      if (res.isApproved()){
        this.router.navigate(['/'])
      }
    })
  }
}