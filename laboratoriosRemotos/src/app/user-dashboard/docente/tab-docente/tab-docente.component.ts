import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-docente',
  templateUrl: './tab-docente.component.html',
  styleUrls: ['./tab-docente.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabDocenteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
