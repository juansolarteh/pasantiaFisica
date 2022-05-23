import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/modelos/user';
import { UserService } from 'src/app/servicios/user.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit{
  @Input() titleList: string = ''
  @Input() personList: User[] = []
  obsPersonList: Observable<User[]> = of(this.personList)
  myPersonList: User[] = []
  deletePerson: User = {
    name: '',
    email: '',
    rol: ''
  }

  constructor(public dialog: MatDialog, private userSvc: UserService) {}

  ngOnInit(): void {
    this.obsPersonList.subscribe(list =>{
      this.myPersonList = list
    })
  }

  delete(contentDialog: any, person: User) {
    this.deletePerson = person
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.deletePerson['rol'] === 'Docente') {

        }
        this.userSvc.deleteUser(this.deletePerson['email']).then(res => {
          if (res) {
            this.personList = this.personList.filter((i) => i !== this.deletePerson);
          }
        })
      }
    });
  }
}
