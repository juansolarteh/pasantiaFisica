import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intructions',
  templateUrl: './intructions.component.html',
  styleUrls: ['./intructions.component.css']
})
export class IntructionsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const aaa = this.route.snapshot.data['practice']
    console.log(aaa)
  }

}
