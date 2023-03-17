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
import Swal from 'sweetalert2';

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
      this.openSwalAlert("Error al matricular", `El código <b>${this.codeSubject}</b> no está asociado a ninguna materia.`, 'error')
      return
    }
    let response = await this.subjectSvc.studentBelongToSubject(userRef, subject.getId())
    if (response) {
      this.openSwalAlert("Error al matricular", `Ya estás matriculado en una materia que tiene código <b>${this.codeSubject}.</b>`, 'warning')
      return
    }
    let newSubject = await this.subjectSvc.registerStudent(userRef, subject.getId())
    let subjectAllInfo = await this.getAllInfo(newSubject)
    await this.onNewSubject.emit(subjectAllInfo)
    this.openSwalAlert("Operación exitosa", `Te has matriculado a <b>${subjectAllInfo.getObjectDB().getNombre()}</b> exitosamente.`, 'success')
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

  private openSwalAlert(title: string, message: string, icon: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showConfirmButton: false,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cerrar'
    })
  }
}
