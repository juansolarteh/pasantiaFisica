import { SubjectTeacher } from './../../models/SubjectTeacher';
import { GroupsService } from 'src/app/services/groups.service';
import { DocumentReference } from '@firebase/firestore';
import { UserService } from 'src/app/services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Subject } from '../../models/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<Subject>[];

  constructor(private activatedRoute: ActivatedRoute, private readonly router: Router,
    private subjectSvc: SubjectService, private userSvc: UserService,
    private cdr: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.subjects = this.activatedRoute.snapshot.data['subjects'];
  }

  goToPractices(subject: ObjectDB<Subject>) {
    localStorage.setItem("subjectSelected", subject.getId())
    this.router.navigate(['../subject', subject.getId()], { relativeTo: this.activatedRoute })
  }

  goToSubjectTopBar(subject: ObjectDB<Subject>) {
    localStorage.setItem("subjectSelected", subject.getId())
    this.router.navigateByUrl(`studentDashboard/subject/${subject.getId()}`)
  }
  async goToDeleteSubject(subject: ObjectDB<Subject>) {
    const studentRef = this.userSvc.getUserLoggedRef()
    //2. Eliminar estudiante de la colección Materias, en Arreglo estudiantes y el arreglo sinGrupo en caso de que exista ahí.
    await this.subjectSvc.unregisterStudent(studentRef, subject.getId())
    this.deleteSubjectOnArray(subject)
    this.openSwalAlert("Operación exitosa", `Te has desmatriculado de <b>${subject.getObjectDB().getNombre()}</b> exitosamente`, 'success')
    //Nota: No es seguro si se debe eliminar del grupo o de los agendamientos ya que podria afectar a los demas compañeros.
    //Esto queda como Nota para los desarrolladores y dueños del producto.
  }
  setNewSubject(newSubject: ObjectDB<Subject>) {
    if (newSubject) {
      this.subjects.push(newSubject)
    }
  }
  private deleteSubjectOnArray(subject: ObjectDB<Subject>) {
    this.subjects = this.subjects.filter(element => element.getId() !== subject.getId())
    this.cdr.detectChanges();
  }

  logOut() {
    this.authService.logout().then(res => {
      if (res.isApproved()) {
        this.router.navigate(['/'])
      }
    })
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