import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  docentes: Usuario[] = []
  laboratoristas: Usuario[] = []

  constructor(private readonly route: ActivatedRoute, private userSvc: UsuarioService) { }

  ngOnInit(): void {
    const workers: Usuario[] = this.route.snapshot.data['workers']
    workers.forEach(worker => {
      if (worker['rol'] === 'Docente') {
        this.docentes.push(worker)
      } else {
        this.laboratoristas.push(worker)
      }
    })
  }

  getRol(): string {
    const rol = localStorage.getItem('rol')
    if (rol) {
      return rol
    }
    return ''
  }

  deleteUser(user: Usuario){
    if (user['rol'] === 'Docente'){
      this.docentes = this.docentes.filter((i) => i !== user);
    }else{
      this.laboratoristas = this.laboratoristas.filter((i) => i !== user);
    }
  }
  onAddUser(){
    this.userSvc.addUser({
      nombre: 'prueba',
      correo: 'prueba',
      rol: 'Docente'
    })
  }
}
