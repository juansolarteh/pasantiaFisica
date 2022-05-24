import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/modelos/user';
import { UserService } from 'src/app/servicios/user.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent{
  @Input() titleList: string = ''
  @Input() personList: User[] = []
  @Output () deletePerson: EventEmitter<User> = new EventEmitter();
  deletedPerson: User = {
    name: '',
    email: '',
    rol: ''
  }

  constructor(public dialog: MatDialog, private userSvc: UserService) {}


  delete(contentDialog: any, person: User) {
    this.deletedPerson = person
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.userSvc.deleteUser(this.deletedPerson['email'], this.deletedPerson['rol']).then(res => {
          if (res) {
            this.deletePerson.emit(this.deletedPerson)
          }
        })
      }
    });
  }
}
