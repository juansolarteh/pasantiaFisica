import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../modelos/user';
import { UserService } from '../servicios/user.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {


  docentes: User[] = []
  laboratoristas: User[] = []

  constructor(private readonly route: ActivatedRoute) { }

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
}
