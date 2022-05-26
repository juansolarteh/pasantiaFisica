import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-tab-estudiante',
  templateUrl: './tab-estudiante.component.html',
  styleUrls: ['./tab-estudiante.component.css']
})
export class TabEstudianteComponent implements OnInit {

  constructor(private userSvc: UsuarioService) { }

  async ngOnInit(){
    const id = localStorage.getItem('idUsuario')
    if (id){
      const doc = this.userSvc.getUser(id);
      const a: DocumentData | undefined = (await doc)
      if (a){
        console.log(a['materias'])
      }
    }
  }
}
