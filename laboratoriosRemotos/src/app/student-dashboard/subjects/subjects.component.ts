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

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<Subject>[];
  
  constructor( private activatedRoute: ActivatedRoute, private readonly router: Router,
    private subjectSvc : SubjectService, private userSvc : UserService, private groupSvc : GroupsService,
    private _snackBar: MatSnackBar, private authService : AuthService) { }

  ngOnInit(): void{
    this.subjects = this.activatedRoute.snapshot.data['subjects'];
  }

  goToPractices(subject:ObjectDB<Subject>){
    localStorage.setItem("subjectSelected",subject.getId())
    this.router.navigate(['../subject',subject.getId()], {relativeTo: this.activatedRoute})
  }

  goToSubjectTopBar(subject:ObjectDB<Subject>){
    localStorage.setItem("subjectSelected",subject.getId())
    this.router.navigateByUrl(`studentDashboard/subject/${subject.getId()}`)
  }
  async goToDeleteSubject(subject:ObjectDB<Subject>){
    const studentRef = this.userSvc.getUserLoggedRef()
    //1. Verificar si el estudiante tiene grupo
    const validation = await this.subjectSvc.studentBelongToWithoutGroup(studentRef,subject.getId())
    //2. Eliminar estudiante de la colección Materias en Arreglo estudiantes y el arreglo sinGrupo en caso de que exista ahí.
    if(validation){
      await this.subjectSvc.unregisterStudent(studentRef,subject.getId())
      this.deleteSubjectOnArray(subject)
      this._snackBar.open("Te has desmatriculado exitosamente")
      return
    }
    //4. Si está con grupo se debe buscar el grupo y eliminarlo del grupo.
    const refGroups = await this.subjectSvc.getRefGroupsFromSubjectId(subject.getId())
    const validate = await this.groupSvc.deleteStudentFromGroup(refGroups,studentRef)
    
    //4.1 Si el grupo queda vacío se elimina el grupo.

    //4.2 Si hay agendamientos para ese grupo, se debe eliminar de los agendamientos.
    //
    
    //let validate = await this.groupSvc.studentBelongAnyGroup(studentRef,refGroups)
    //console.log(validate);
    
  }
  setNewSubject(newSubject : ObjectDB<Subject>){
    console.log("Emitido" , newSubject);
    if(newSubject){
      this.subjects.push(newSubject)
    }
  }
  private deleteSubjectOnArray(subject : ObjectDB<Subject>){
    this.subjects = this.subjects.filter(element => element.getId() != subject.getId())
  }

  logOut(){
    this.authService.logout().then(res => {
      if (res.isApproved()){
        this.router.navigate(['/'])
      }
    })
  }
}