import { Subject } from 'src/app/models/Subject';
import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group, GroupWithNames } from 'src/app/models/Group';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { UserService } from 'src/app/services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-students-without-group',
  templateUrl: './students-without-group.component.html',
  styleUrls: ['./students-without-group.component.css']
})
export class StudentsWithoutGroupComponent implements OnInit {

  
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { studentsWithOutGroup: ObjectDB<GroupWithNames>, currentUser: MemberGroup, subjectSelected: ObjectDB<Subject> },
    private _snackBar: MatSnackBar,private userSvc: UserService,private subjectSvc: SubjectService,private groupSvc: GroupsService) { }
  
  selectedGroup!: MemberGroup[]
  leaderSelected!: MemberGroup[]
  
  @ViewChild('stepper') stepper!: MatStepper;
  onGroupCreated : EventEmitter<GroupWithNames> = new EventEmitter<GroupWithNames>()

  ngOnInit(): void {
    console.log("Data recibida en modal", this.data);
    
  }
  onGroupsChange(auxGroup: MemberGroup[]) {
    if (auxGroup.length > this.data.subjectSelected.getObjectDB().getNumGrupos()) {
      this.openSnackBar("El número de estudiantes no debe ser mayor a " + this.data.subjectSelected.getObjectDB().getNumGrupos(), "Cerrar")
    }
  }
  onGroupSelected(){
    if(this.selectedGroup.length === 1){
      this.openSnackBar("Debe seleccionar al menos un compañero para crear un grupo", "Cerrar")
      return
    }
    if(this.stepper.selected != undefined){
      this.stepper.selected.completed = true
      this.stepper.next();
    }
  }
  onCreateGroup(){
    if(this.stepper.selected != undefined){
      console.log("Lider seleccionado", this.leaderSelected);
      console.log("Grupo seleccionado", this.selectedGroup);
      //1. Sacar los estudiantes de Sin grupo
      let groupRefs = this.selectedGroup.map(member => this.userSvc.getRefUser(member.getId()))
      this.subjectSvc.takeOutStudents(groupRefs, this.data.subjectSelected.getId())
      //2. Crear obj con el grupo establecido
      let leaderRef = this.userSvc.getRefUser(this.leaderSelected[0].getId())
      let newGroup = new Group(groupRefs, leaderRef)
      //3. Llamar al servicio para la creacion
      this.groupSvc.createGroup(newGroup).then(res=>{
        this.subjectSvc.getRefSubjectFromId(this.data.subjectSelected.getId())
        this.subjectSvc.createGroup(res)
        let groupCreated = new GroupWithNames(this.selectedGroup,this.leaderSelected[0].getId())
        this.onGroupCreated.emit(groupCreated)
      })

      /* let leaderRef = this.userSvc.getRefUser(this.leaderSelected[0].getId())
      let groupRefs = this.selectedGroup.map(member => this.userSvc.getRefUser(member.getId()))
      this.subjectSvc.takeOutStudents(groupRefs, this.data.subjectSelected.getId())
      let newGroup = new Group(groupRefs, leaderRef)
      this.groupSvc.createGroup(newGroup).then(res=>{
        this.subjectSvc.getRefSubjectFromId(this.data.subjectSelected.getId())
        this.subjectSvc.createGroup(res)
        let groupCreated = new GroupWithNames(this.selectedGroup,this.leaderSelected[0].getId())
        console.log("Emitiendo desde modal", groupCreated);
        this.onGroupCreated.emit(groupCreated)
      }) */
    }
  }
  onLeaderSelected(){
    if(this.leaderSelected){
      if(this.stepper.selected != undefined){
        this.stepper.selected.completed = true
        this.stepper.next();
      }
    }else{
      this.openSnackBar("Por favor, seleccione un líder", "Cerrar")
    }
  }
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
