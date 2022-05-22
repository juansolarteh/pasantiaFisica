import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit(): void {
    
  }

  renderizado(){
    console.log("render user-dashboard")
    return true
  }

  getRol(): string{
    const rol = localStorage.getItem('rol')
    if (rol){
      return rol
    }
    return ''
  }

}
