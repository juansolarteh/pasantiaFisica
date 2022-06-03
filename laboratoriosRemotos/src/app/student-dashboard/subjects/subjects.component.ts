import { UsuarioService } from './../../servicios/usuario.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  materias: any[] = [];
  constructor(private userService: UsuarioService, private subjectService: CursoService) { }

  async ngOnInit(): Promise<void> {
    const id = localStorage.getItem('idUsuario')
    if (id != null) {
      const doc = await this.userService.getUser(id)
      if (doc != undefined) {
        this.subjectService.getSubjectsFromStudent(doc).then(res => {
          //alert("obtuvo algo")
          this.materias = res
        }).catch(e => {
          console.log("Error", e)
        })
      }
    }
  }
}
