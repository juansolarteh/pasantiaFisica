import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { SubjectUltimo } from 'src/app/models/SubjectUltimo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectComponent implements OnInit, OnDestroy {

  private subscriber!: Subscription;
  subject !: SubjectUltimo;
  subjectId!: string
  selectedTab = 0;

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute, private subjectSvc: SubjectService) { }

  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let subjectId = params['subjectId'];
      let subjectDB: ObjectDB<SubjectUltimo> = this.subjectSvc.getSubjectById(subjectId);
      this.subject = subjectDB.getObjectDB();
      this.subjectId = subjectDB.getId();
    })
    this.verifyRoute()
  }

  changeTab(event: any) {
    switch (event.index) {
      case 0: this.router.navigate(['./p'], { relativeTo: this.activatedRoute });
        break;
      case 1: this.router.navigate(['./g'], { relativeTo: this.activatedRoute })
        break;
      default: this.router.navigate(['/'], { relativeTo: this.activatedRoute })
    }
  }

  private verifyRoute() {
    var urlSegment = this.getLastPath()
    if (urlSegment === 'g' && this.selectedTab == 0) {
      this.selectedTab = 1
    }

    this.subscriber = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      var urlSegment = this.getLastPath()
      if (urlSegment == 'g' && this.selectedTab == 0) {
        this.selectedTab = 1
      } else {
        this.selectedTab = 0
      }
    })
  }

  private getLastPath() {
    let lastPath!: string
    this.activatedRoute.firstChild?.url.forEach(urlSeg => {
      lastPath = urlSeg[0].path;
    })
    return lastPath
  }
}