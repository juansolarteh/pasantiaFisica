import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private readonly router: Router){}

  ngOnInit(): void {
    if (false){
      this.router.navigate(['home'])
    }else{
      this.router.navigate(['sesion'])
    }
  }
}
