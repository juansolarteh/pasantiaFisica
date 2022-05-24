import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout().then(res => {
      if (res.approved){
        this.router.navigate(['/'])
      }
    })
  }
}
