import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/servicios/curso.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent implements OnInit {

  materias: any[] = ['W5sRL0virwyAppAvnGYo'];

  constructor(private readonly router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('desde la lista de subjects. Falta traer los subjects')
  }

  goToSubject(subject: string) {
    this.router.navigate(['../subject', subject], { relativeTo: this.activatedRoute })
  }
}
