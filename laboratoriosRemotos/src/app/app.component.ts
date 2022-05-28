import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './servicios/auth.service';
import { UsuarioService } from './servicios/usuario.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private readonly router: Router, private authService: AuthService, private userSvc: UsuarioService,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    const emailUser: string | null = localStorage.getItem('email')
    if (emailUser == null) {
      this.authService.logout()
      this.router.navigate(['/'])
      return
    }

    await this.userSvc.defineRol(emailUser)
    const rol = localStorage.getItem('rol')
    if (rol) {
      const ruta = this.router.routerState.snapshot.url
      if (ruta == '/app') {
        if (rol == 'Docente') {
          this.router.navigate(['teacherDashboard'])
        } else if (rol == 'Estudiante') {
          this.router.navigate(['studentDashboard'])
        } else {
          this.router.navigate(['managerDashboard'])
        }
      }
    }
  }
}
