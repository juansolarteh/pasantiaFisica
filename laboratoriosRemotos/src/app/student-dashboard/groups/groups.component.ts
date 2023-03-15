import { StudentsWithoutGroupComponent } from './students-without-group/students-without-group.component';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupsService } from 'src/app/services/groups.service';
import { SubjectService } from 'src/app/services/subject.service';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { Group, GroupWithNames } from './../../models/Group';
import { ObjectDB } from './../../models/ObjectDB';
import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'src/app/models/Subject';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild('btnAddGroup') btnAddGroup!: MatButton
  constructor(private activatedRoute: ActivatedRoute,
    private userSvc: UserService, 
    private groupSvc: GroupsService,
    private subjectSvc: SubjectService,
    private _snackBar: MatSnackBar,
    public groupDialog: MatDialog) { }

  currentUser!: MemberGroup
  studentGroup!: ObjectDB<GroupWithNames>
  studentsWithOutGroup!: ObjectDB<GroupWithNames>
  subjectSelected!: ObjectDB<Subject>

  ngOnInit() {
    this.currentUser = this.activatedRoute.snapshot.data['currentUser']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.studentsWithOutGroup = this.activatedRoute.snapshot.data['studentsWithoutGroup']
  }

  onCreateGroup(){
    if(this.studentsWithOutGroup.getObjectDB().getGrupo().length == 1 ){
      this.openSwalAlert('Error al crear grupo','Eres el único estudiante sin grupo en esta asignatura, contacta a tu docente para solucionar este inconveniente.','info')
      return
    }
    let dialogRef = this.groupDialog.open(StudentsWithoutGroupComponent,
      { data: {studentsWithOutGroup : this.studentsWithOutGroup, currentUser: this.currentUser, subjectSelected : this.subjectSelected},
      height: 'auto', width: '750px'} )
      const dialogSuscription = dialogRef.componentInstance.onGroupCreated.subscribe(groupCreated =>{
        console.log("Recibiendo desde Modal Creacion",groupCreated);
        this.studentGroup = new ObjectDB<GroupWithNames>(groupCreated,'new')
        this.openSwalAlert("Grupo creado","El grupo se ha creado exitosamente.", 'success')
        dialogSuscription.unsubscribe()
      })
  }


  private openSwalAlert(title : string,message: string, icon : any ) {
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
