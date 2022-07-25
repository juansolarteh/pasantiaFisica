import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-practice-execution',
  templateUrl: './practice-execution.component.html',
  styleUrls: ['./practice-execution.component.css']
})
export class PracticeExecutionComponent implements OnInit {

  group!: string[]

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.group = this.route.snapshot.data['group'];
  }

}
