import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-practice-teacher-execution',
  templateUrl: './practice-teacher-execution.component.html',
  styleUrls: ['./practice-teacher-execution.component.css']
})
export class PracticeTeacherExecutionComponent implements OnInit {

  group!: string[]

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.group = this.route.snapshot.data['group'];
  }

}
