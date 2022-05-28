import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent implements OnInit {

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('desde la lista de subjects')
  }

  goToSubject(subject: string){
    this.router.navigate(['../subject', subject], {relativeTo: this.activatedRoute})
  }
}
