import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  practiceDB!: ObjectDB<Practice>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.practiceDB = this.route.snapshot.data['practice'];
    console.log(this.practiceDB)
  }
}
