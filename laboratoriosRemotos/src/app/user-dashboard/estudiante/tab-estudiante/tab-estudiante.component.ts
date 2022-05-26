import { Component, OnInit } from '@angular/core';
import { Diccionario } from 'src/app/modelos/diccionario';
import { CursoService } from 'src/app/servicios/curso.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { DocumentData, DocumentReference } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab-estudiante',
  templateUrl: './tab-estudiante.component.html',
  styleUrls: ['./tab-estudiante.component.css']
})
export class TabEstudianteComponent implements OnInit {

  constructor(private subjSvc: CursoService, private userSvc: UsuarioService) { }

  ngOnInit(){
    const id = localStorage.getItem('idUsuario')
    if (id){
      const obs = this.userSvc.getUser(id)
      obs.subscribe(doc => {
        console.log(doc.data())
      })
    }
  }
}
