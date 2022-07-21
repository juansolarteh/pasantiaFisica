import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectComponent implements OnInit, OnDestroy {

  private subscriber!: Subscription;
  subject !: SubjectTeacher;
  links = [
    {
      label: 'practicas',
      link: 'p'
    },
    {
      label: 'grupos',
      link: 'g'
    }
  ];
  activeLink = this.links[0].link;

  constructor(private readonly router: Router, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.subject = data['subject']
      localStorage.setItem('numGroup', this.subject.getNumGrupos().toString())
    });
    this.activeLink = this.router.url.split('/').pop()!
    this.subscriber = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.activeLink = event.url.split('/').pop()!
    });
  }
}