import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/app/modelos/usuario';
import { UserService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent{
  @Input() titleList: string = ''
  @Input() personList: Usuario[] = []
  @Output () deletePerson: EventEmitter<Usuario> = new EventEmitter();
  deletedPerson: Usuario = {
    nombre: '',
    correo: '',
    rol: ''
  }

  constructor(public dialog: MatDialog, private userSvc: UserService) {}


  delete(contentDialog: any, person: Usuario) {
    this.deletedPerson = person
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.userSvc.deleteUser(this.deletedPerson['correo'], this.deletedPerson['rol']).then(res => {
          if (res) {
            this.deletePerson.emit(this.deletedPerson)
          }
        })
      }
    });
  }
}
