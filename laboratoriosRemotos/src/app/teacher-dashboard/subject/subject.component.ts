import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SubjectUltimo } from 'src/app/models/SubjectUltimo';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectComponent implements OnInit, OnDestroy {

  private managerRoute!: Subscription;
  subject !: SubjectUltimo;
  selectedTab = 0;

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute,
    private subjectSvc: SubjectService, private changeDetector: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.managerRoute?.unsubscribe();
    localStorage.removeItem('subjectId')
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async params => {
      let subjectId = params['subjectId'];
      localStorage.setItem('subjectId', subjectId)
      this.subject = await this.subjectSvc.getSubjectById(subjectId);
      this.changeDetector.markForCheck();
    })
    this.verifyRoute()
  }

  changeTab(event: any) {
    switch (event.index) {
      case 0: this.router.navigate(['./p'], { relativeTo: this.activatedRoute });
        break;
      case 1: this.router.navigate(['./g'], { relativeTo: this.activatedRoute });
        break;
      default: this.router.navigate(['/'], { relativeTo: this.activatedRoute });
    }
  }

  private verifyRoute() {
    var urlSegment = this.getLastPath()
    if (urlSegment === 'g') {
      if (this.selectedTab == 0){
        this.selectedTab = 1
      }
      this.router.navigate(['./g'], { relativeTo: this.activatedRoute });
    }else{
      this.router.navigate(['./p'], { relativeTo: this.activatedRoute });
    }

    this.managerRoute = this.router.events.pipe(
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