import { GroupsService } from 'src/app/services/groups.service';
import { User } from 'src/app/models/User';
import { UserService } from './../../../services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/subject.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Subject } from 'src/app/models/Subject';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';

@Component({
  selector: 'app-code-subject-card',
  templateUrl: './code-subject-card.component.html',
  styleUrls: ['./code-subject-card.component.css']
})
export class CodeSubjectCardComponent implements OnInit {

  codeSubject: string = ""
  userRef!: User
  @Output() onNewSubject: EventEmitter<ObjectDB<Subject>> = new EventEmitter()
  constructor(private subjectSvc: SubjectService, private userSvc: UserService, private groupSvc: GroupsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }
  async handleRegister() {
    let userRef = this.userSvc.getUserLoggedRef()
    let subject = await this.subjectSvc.getSubjectByKey(this.codeSubject);
    if (!subject) {
      this.openSnackBar("El código de la materia no existe", "Cerrar")
      return
    }
    let response = await this.subjectSvc.studentBelongToSubject(userRef, subject.getId())
    if (response) {
      this.openSnackBar("Ya estás matriculado en esta asignatura", "Cerrar")
      return
    }
    let newSubject = await this.subjectSvc.registerStudent(userRef, subject.getId())
    let subjectAllInfo = await this.getAllInfo(newSubject)
    this.onNewSubject.emit(subjectAllInfo)
    this.openSnackBar("Te has matriculado exitosamente", "Cerrar")
    this.codeSubject = ""
  }

  private async getAllInfo(subject: ObjectDB<SubjectTeacher>) {
    let name = await this.userSvc.getUserName(subject.getObjectDB().getDocente())
    let newSubject = new Subject(subject.getObjectDB().getClave(),
      subject.getObjectDB().getDescripcion(),
      name, subject.getObjectDB().getNombre(),
      subject.getObjectDB().getNumGrupos())
    return new ObjectDB<Subject>(newSubject, subject.getId())
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
