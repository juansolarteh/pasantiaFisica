import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { NavbarService } from 'src/app/services/navbar.service';

interface linkSideNav {
  id?: String,
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
  indexSubject = 0;

  constructor(private route: ActivatedRoute, private router: Router, private navbarSvc: NavbarService) { }

  ngOnInit(): void {
    this.openSideNav = false
    let subjects: ObjectDB<string>[] = this.route.snapshot.data['subjectNames'];
    let namePlants: ObjectDB<string>[] = this.route.snapshot.data['plantNames'];
    this.linksSideNav = [{ link: '/teacherDashboard', ico: 'home', label: 'Home' }, { label: 'Cursos' }]
    this.linksSideNav = this.linksSideNav.concat(subjects.map(s => {
      let linkNav: linkSideNav = {
        id: s.getId(),
        ico: 'subject',
        label: s.getObjectDB(),
        link: '/teacherDashboard/subject/' + s.getId() + '/p'
      }
      return linkNav
    }))
    this.indexSubject = this.linksSideNav.length;
    this.linksSideNav.push({ label: 'Plantas' })
    this.linksSideNav = this.linksSideNav.concat(namePlants.map(p => {
      let linkNav: linkSideNav = {
        id: p.getId(),
        ico: 'precision_manufacturing',
        label: p.getObjectDB(),
        link: '/teacherDashboard/calendarPlant/' + p.getId()
      };
      return linkNav
    }))
    this.subscribeNewSubject();
    this.subscribeOldSubject();
  }

  subscribeNewSubject() {
    this.navbarSvc.getNewSubject().subscribe(subj => {
      let inicio = this.linksSideNav.slice(0, this.indexSubject);
      let final = this.linksSideNav.slice(this.indexSubject);
      inicio.push({
        id: subj.getId(),
        ico: 'subject',
        label: subj.getObjectDB(),
        link: '/teacherDashboard/subject/' + subj.getId() + '/p'
      })
      this.linksSideNav = inicio.concat(final)
      this.indexSubject ++
    })
  }

  subscribeOldSubject() {
    this.navbarSvc.getOldSubject().subscribe(subjId => {
      this.linksSideNav = this.linksSideNav.filter((lsn) => lsn.id !== subjId)
      this.indexSubject --
    })
  }

  navigateTo(root: string) {
    if (root) {
      this.router.navigate([root], { relativeTo: this.route })
    }
    this.openSideNav = false
  }
}
