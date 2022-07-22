import { GroupsService } from 'src/app/services/groups.service';
import { User } from 'src/app/models/User';
import { UserService } from './../../../services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-code-subject-card',
  templateUrl: './code-subject-card.component.html',
  styleUrls: ['./code-subject-card.component.css']
})
export class CodeSubjectCardComponent implements OnInit {

  codeSubject: string = ""
  userRef!: User
  constructor(private subjectSvc: SubjectService, private userSvc: UserService, private groupSvc: GroupsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }
  async handleRegister() {
    let userRef = this.userSvc.getUserLoggedRef()
    let subject = await this.subjectSvc.getSubjectByKey(this.codeSubject);
    if (subject) {
      let validation = await this.subjectSvc.studentBelongToWithoutGroup(userRef, subject.getId())
      if (validation) {
        this.openSnackBar("Ya estás matriculado en esta materia", "Cerrar")
      } else {
        this.subjectSvc.getRefGroupsFromSubjectId(subject.getId()).then(refGroups => {
          this.groupSvc.studentBelongAnyGroup(userRef, refGroups).then(res => {
            console.log("Respuesta",res);
            
          })
        })
      }
    } else {
      this.openSnackBar("El código de la materia no existe", "Cerrar")
    }
  }
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
