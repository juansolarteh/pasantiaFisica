import { GroupWithNames } from './../../models/Group';
import { ObjectDB } from './../../models/ObjectDB';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute) { }

  studentGroup!: ObjectDB<GroupWithNames> | undefined
  ngOnInit(): void {
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    console.log("Desde vista grupo",this.studentGroup)
  }

}
