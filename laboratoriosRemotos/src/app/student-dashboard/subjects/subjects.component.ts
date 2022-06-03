import { Subject } from './../../modelos/Subject';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from './../../servicios/usuario.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  materias: Subject[] = [];
  
  constructor(private userService: UsuarioService, private subjectService: CursoService ) { }

  async ngOnInit(): Promise<void> {
    
    const id = localStorage.getItem('idUsuario')
    if (id != null) {
      const doc = await this.userService.getUser(id)
      if (doc != undefined) {
        this.subjectService.getSubjectsFromStudent(doc).then(res => {
          //alert("obtuvo algo")
          this.materias = res
          console.log(this.materias)
        }).catch(e => {
          console.log("Error", e)
        })
      }
    }
  }

  goToPractices(){
    alert("Yendo a practica")
    this.materias.forEach(element => {
      console.log(element.getSubjectInfo()?.nombre)
      
    });
    //this.currentRoute
    //this.router.navigate(['../subject', subject], {relativeTo: this.activatedRoute})
  }
  goToDeleteSubject(){
    alert("Yendo a elimitar asignatura")
  }
}
