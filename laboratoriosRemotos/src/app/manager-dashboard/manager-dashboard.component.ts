import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../modelos/user';
import { UserService } from '../servicios/user.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  docentes: User[] = []
  laboratoristas: User[] = []

  constructor(private readonly route: ActivatedRoute, private userSvc: UserService) { }

  ngOnInit(): void {
    const workers: User[] = this.route.snapshot.data['workers']
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

  deleteUser(user: User){
    if (user['rol'] === 'Docente'){
      this.docentes = this.docentes.filter((i) => i !== user);
    }else{
      this.laboratoristas = this.laboratoristas.filter((i) => i !== user);
    }
  }
  onAddUser(){
    this.userSvc.addUser({
      name: 'prueba',
      email: 'prueba',
      rol: 'Docente'
    })
  }
}
