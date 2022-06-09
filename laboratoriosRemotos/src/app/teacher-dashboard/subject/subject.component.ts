import { ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectComponent implements OnInit, OnDestroy {

  public subscriber!: Subscription;

  subject !: string
  activeLink = 'p'
  firstSelection = 0

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
    localStorage.removeItem('subject')
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.subject = params['subjectId']
      localStorage.setItem('subject', this.subject)
    })
    var lastWord = this.router.url.split('/').pop();
    if (lastWord == 'g' && this.firstSelection == 0) {
      this.firstSelection = 1
      this.activeLink = 'g'
    }

    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      var lastWord = this.router.url.split('/').pop();
      if (lastWord == 'g' && this.firstSelection == 0) {
        this.firstSelection = 1
        this.activeLink = 'g'
      }else{
        this.firstSelection = 0
        this.activeLink = 'p'
      }
    })
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
