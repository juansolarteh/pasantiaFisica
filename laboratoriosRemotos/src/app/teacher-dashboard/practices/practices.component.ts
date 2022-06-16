import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PracticesComponent implements OnInit {

  practices: ObjectDB<Practice>[] = [];
  newPractice = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.practices = this.activatedRoute.snapshot.data['practices'];
  }

  showPractice(practice: Practice){
    console.log(practice)
  }

}
