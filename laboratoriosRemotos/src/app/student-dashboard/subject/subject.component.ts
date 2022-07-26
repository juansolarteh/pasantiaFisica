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
  links = ['Prácticas', 'Calendario', 'Grupo'];
  activeLink = ""
  background: ThemePalette = undefined;

  ngOnInit(): void {
    this.activeLink = this.links[0];
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
  }
  changeTab(event:any){
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
  changeLink(link:number){
    switch(link){
      case 0: this.activeLink = this.links[0]; 
      this.router.navigate(['./practices'], {relativeTo: this.activatedRoute});
      break;
      case 1: this.activeLink = this.links[1]; 
      this.router.navigate(['./calendar'], {relativeTo: this.activatedRoute})
      break;
      case 2: this.activeLink = this.links[2];  
      this.router.navigate(['./groups'], {relativeTo: this.activatedRoute})
      break;
      default: this.router.navigate(['/'], {relativeTo: this.activatedRoute})
    }
  }
  salir(){
    this.authService.logout().then(res => {
      if (res.isApproved()){
        this.router.navigate(['/'])
      }
    })
  }
}