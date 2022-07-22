import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html'
})
export class PracticeComponent implements OnInit, OnDestroy {

  private subscriber!: Subscription;
  links = [
    {
      label: 'intrucciones',
      link: 'i'
    },
    {
      label: 'practicas de los estudiantes',
      link: 'p'
    }
  ];
  activeLink = this.links[1].link;

  constructor(private readonly router: Router) { }

  ngOnDestroy(): void {
    this.subscriber?.unsubscribe();
  }

  ngOnInit(): void {
    this.activeLink = this.router.url.split('/').pop()!
    this.subscriber = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.activeLink = event.url.split('/').pop()!
    });
  }
}
