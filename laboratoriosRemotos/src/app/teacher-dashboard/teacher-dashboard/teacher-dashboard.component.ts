import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';

interface linkSideNav {
  ico?: string,
  link?: string,
  label: string
}

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {

  linksSideNav!: linkSideNav[];
  openSideNav!: boolean;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.openSideNav = false
    let subjects: ObjectDB<string>[] = this.route.snapshot.data['subjectNames'];
    let namePlants: ObjectDB<string>[] = this.route.snapshot.data['plantNames'];
    this.linksSideNav = [{link: '/teacherDashboard', ico: 'home', label: 'Home'}, {label: 'Cursos'}]
    this.linksSideNav = this.linksSideNav.concat(subjects.map(s => {
      let linkNav: linkSideNav = {
        ico: 'subject',
        label: s.getObjectDB(),
        link: '/teacherDashboard/subject/' + s.getId() + '/p'
      }
      return linkNav
    }))
    this.linksSideNav.push({label: 'Plantas'})
    this.linksSideNav = this.linksSideNav.concat(namePlants.map(p => {
      let linkNav: linkSideNav = {
        ico: 'precision_manufacturing',
        label: p.getObjectDB(),
        link: '/teacherDashboard/calendarPlant/' + p.getId()
      };
      return linkNav
    }))
  }

  navigateTo(root: string){
    if(root){
      this.router.navigate([root], {relativeTo: this.route})
    }
    this.openSideNav = false
  }
}
