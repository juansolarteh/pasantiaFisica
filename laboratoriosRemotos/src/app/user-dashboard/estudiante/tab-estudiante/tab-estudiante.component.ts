import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { CursoService } from 'src/app/servicios/curso.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-tab-estudiante',
  templateUrl: './tab-estudiante.component.html',
  styleUrls: ['./tab-estudiante.component.css']
})
export class TabEstudianteComponent implements OnInit {
  

  constructor(private userSvc: UsuarioService, private cursoService : CursoService) { }
  materias: any[] = [];
  
  async ngOnInit(){
    const id = localStorage.getItem('idUsuario')
    console.log("Id", id)
    if (id != null) {
      const doc = await this.userSvc.getUser(id)
      if (doc != undefined) {
        this.cursoService.getSubjectsFromStudent(doc).then(res=>{
          this.materias = res
        }).catch(e =>{
          console.log("Error", e)
        })
      }
    }
  }
}
