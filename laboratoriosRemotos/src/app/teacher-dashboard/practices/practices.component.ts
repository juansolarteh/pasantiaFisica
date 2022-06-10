import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/servicios/curso.service';

@Component({
  selector: 'app-practices',
  templateUrl: './practices.component.html',
  styleUrls: ['./practices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PracticesComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private subjectSvc: CursoService) { }

  ngOnInit(): void {
    console.log('traido de practicas => ', this.subjectSvc.subjectSelectedRef)
  }

}
