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

  materias: Subject[] = [];
  
  constructor(private userService: UserService, private subjectService: SubjectService,
    private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    
    const id = localStorage.getItem('idUsuario')
    if (id != null) {
      const doc = await this.userService.getUser(id)
      if (doc != undefined) {
        this.subjectService.getSubjectsFromStudent(doc).then(res => {
          this.materias = res
        }).catch(e => {
          console.log("Error", e)
        })
      }
    }
  }

  goToPractices(subject: Subject){
    localStorage.setItem("selectedSubject" , JSON.stringify(subject))
    //this.router.navigate(['../subject',subject.getSubjectId()], {relativeTo: this.activatedRoute})
  }
  goToDeleteSubject(){
    alert("Yendo a elimitar asignatura")
  }
}
