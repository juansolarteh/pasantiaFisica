import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-students-without-group',
  templateUrl: './students-without-group.component.html',
  styleUrls: ['./students-without-group.component.css']
})
export class StudentsWithoutGroupComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  studentsWithOutGroup!: ObjectDB<GroupWithNames>

  ngOnInit(): void {
    this.studentsWithOutGroup = this.activatedRoute.snapshot.data['studentsWithoutGroup']
  }

}
