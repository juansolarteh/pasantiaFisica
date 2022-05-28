import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectComponent implements OnInit {

  subject !: string
  activeLink = 'p'
  firstSelection = 0

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.subject = params['subjectId']
    })
    var lastWord = this.router.url.split('/').pop();
    if (lastWord == 'g' && this.firstSelection == 0) {
      this.firstSelection = 1
      this.activeLink = 'g'
    }
  }

  changeView() {
    if (this.activeLink === 'p') {
      this.activeLink = 'g'
    } else {
      this.activeLink = 'p'
    }
    var newRoute = ''
    var list = this.router.url.split('/');
    list.pop()
    list.forEach(word => {
      newRoute += word + '/'
    })
    newRoute += this.activeLink
    this.router.navigateByUrl(newRoute)
  }
}
