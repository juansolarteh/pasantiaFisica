import { UserService } from 'src/app/services/user.service';
import { DialogComponent } from './dialog/dialog.component';
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
  selectedGroup!: MemberGroup[]

  ngOnInit() {
    this.currentUser = this.activatedRoute.snapshot.data['currentUser']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.studentsWithOutGroup = this.activatedRoute.snapshot.data['studentsWithoutGroup']
  }

  onAddToGroup() {

    if (this.selectedGroup === undefined) {
      this.openSnackBar("Seleccione al menos un estudiante ", "Cerrar")
    } else {
      if (!this.selectedGroup.includes(this.currentUser)) {
        this.selectedGroup.push(this.currentUser)
      }
      let dialogRef = this.groupDialog.open(DialogComponent, { data: { selectedGroup: this.selectedGroup, currentUser: this.currentUser }, height: 'auto', width: '700px' })
      const sub = dialogRef.componentInstance.onLeaderSelected.subscribe((leader: MemberGroup[]) => {
        const idSubjectSelected = localStorage.getItem("subjectSelected")!
        let leaderRef = this.userSvc.getRefUser(leader[0].getId())
        let groupRefs = this.selectedGroup.map(member => this.userSvc.getRefUser(member.getId()))
        this.subjectSvc.takeOutStudents(groupRefs, idSubjectSelected)
        let newGroup = new Group(groupRefs, leaderRef)
        this.groupSvc.createGroup(newGroup).then(res => {
          this.subjectSvc.getRefSubjectFromId(idSubjectSelected)
          this.subjectSvc.createGroup(res)
          let newG = new GroupWithNames(this.selectedGroup,leader[0].getId())
          this.studentGroup = new ObjectDB<GroupWithNames>(newG,'new') 
        })
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'close') {
          sub.unsubscribe()
        } else {
          sub.unsubscribe()
        }
      })
    }
  }

  onGroupsChange(auxGroup: MemberGroup[]) {
    if (auxGroup.length <= this.subjectSelected.getObjectDB().getNumGrupos() - 1) {
      this.btnAddGroup.disabled = false
    } else if (auxGroup.length === 0) {
      this.btnAddGroup.disabled = true
    }
    else {
      this.btnAddGroup.disabled = true
      this.openSnackBar("El número máximo de estudiantes por grupo es " + this.subjectSelected.getObjectDB().getNumGrupos(), "Cerrar")
    }
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
