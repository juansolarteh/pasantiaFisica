import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor(private readonly router: Router, private authService: AuthService, private userSvc: UserService,) { }

  ngOnInit() {
    const emailUser: string | null = localStorage.getItem('email');
    if (emailUser == null) {
      this.authService.logout();
      this.router.navigate(['/']);
      return;
    }

    this.userSvc.defineRol(emailUser).then(() => {
      const rol = localStorage.getItem('rol');
      if (rol) {
        const route = this.router.routerState.snapshot.url;
        if (route == '/app') {
          if (rol == 'Docente') {
            this.router.navigate(['teacherDashboard']);
          } else if (rol == 'Estudiante') {
            this.router.navigate(['studentDashboard']);
          } else {
            this.router.navigate(['managerDashboard']);
          }
        }
      }
    });

  }
}
