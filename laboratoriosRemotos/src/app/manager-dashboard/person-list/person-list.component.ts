import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/modelos/usuario';
import { AgendaService } from 'src/app/servicios/agenda.service';
import { CursoService } from 'src/app/servicios/curso.service';
import { GruposService } from 'src/app/servicios/grupos.service';
import { PracticaService } from 'src/app/servicios/practica.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent {
  @Input() titleList: string = ''
  @Input() personList: Usuario[] = []
  @Output() deletePerson: EventEmitter<Usuario> = new EventEmitter();
  deletedPerson: Usuario = {
    nombre: '',
    correo: '',
    rol: ''
  }

  constructor(public dialog: MatDialog, private userSvc: UsuarioService, private groupSvc: GruposService,
    private practiceSvc: PracticaService, private scheduleSvc: AgendaService, private subjectSvc: CursoService) { }

  delete(contentDialog: any, person: Usuario) {
    this.deletedPerson = person
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userSvc.deleteUser(this.deletedPerson['correo'], this.deletedPerson['rol']).then(async subjects => {
          if (subjects) {
            subjects.forEach(async refSubject => {
              this.userSvc.deleteSubjectsOfUsers(refSubject)
              this.groupSvc.deleteGrupos(refSubject);
              const practicesRef = this.practiceSvc.getPracticesRef(refSubject);
              (await practicesRef).forEach(doc => {
                this.scheduleSvc.deleteFromPracticaReference(doc)
              })
              this.practiceSvc.deleteFromSubjectReference(refSubject)
              this.subjectSvc.deleteFromReference(refSubject)
            })
          }
          this.deletePerson.emit(this.deletedPerson)
        })
      }
    });
  }
}
