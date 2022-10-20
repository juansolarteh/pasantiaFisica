import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { GroupWithNames } from 'src/app/models/Group';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { GroupsService } from 'src/app/services/groups.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {

  groups: ObjectDB<GroupWithNames>[] = [];
  memberToDelete!: MemberGroup;
  maxNumGorup!: number
  private endOperation = true;

  constructor(
    private readonly route: ActivatedRoute,
    public dialog: MatDialog,
    private subjectSvc: SubjectService,
    private changeDetector: ChangeDetectorRef,
    private groupSvc: GroupsService,
    private _snackBar: MatSnackBar,
    private scheduleSvc: ScheduleService
  ) { }

  ngOnInit(): void {
    this.groups = this.route.snapshot.data['groups'];
    let sg: ObjectDB<GroupWithNames> = this.route.snapshot.data['withoutGroup'];
    this.maxNumGorup = Number.parseInt(localStorage.getItem('numGroup')!);
    localStorage.removeItem('numGroup')
    if (this.groups.length > 0) {
      let aux = this.groups[0];
      this.groups[0] = sg;
      this.groups.push(aux);
    } else {
      this.groups.push(sg);
    }
  }

  sort(list: MemberGroup[]) {
    list.sort(function (a, b) {
      if (a.getName() > b.getName()) {
        return 1;
      }
      if (a.getName() < b.getName()) {
        return -1;
      }
      return 0;
    })
    return list;
  }

  async drop(event: CdkDragDrop<MemberGroup[]>, contentDialog: any) {
    if (this.endOperation) {
      this.endOperation = false;
      const indexGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.container.data);
      const indexPreviousGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.previousContainer.data);
      if (indexGroup !== 0 && event.container.data.length === this.maxNumGorup) {
        this.openSnackBar('No se puede agregar mas estudiantes. Solo puede haber maximo ' + this.maxNumGorup + ' estudiantes')
        return
      } else if (indexPreviousGroup !== 0 && indexGroup !== indexPreviousGroup && event.previousContainer.data.length === 1) {
        const dialogRef = this.dialog.open(contentDialog);
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            this.deleteSchdule(indexPreviousGroup);
            await this.moveStudent(event, indexGroup, indexPreviousGroup);
          }
        });
      } else if (indexGroup !== indexPreviousGroup) {
        await this.moveStudent(event, indexGroup, indexPreviousGroup)
      }
    }
    this.endOperation = true
  }

  private async moveStudent(event: CdkDragDrop<MemberGroup[]>, indexGroup: number, indexPreviousGroup: number) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const studentId: string = this.groups[indexGroup].getObjectDB().getGrupo()[event.currentIndex].getId();
      if (indexGroup === 0) {
        let refEst = this.groupSvc.outGroup(this.groups[indexPreviousGroup].getId(), studentId);
        this.subjectSvc.inStudent(refEst);
      } else if (indexPreviousGroup === 0) {
        let refEst = this.subjectSvc.outStudent(studentId);
        let refNewGroup = await this.groupSvc.inGroup(this.groups[indexGroup].getId(), refEst);
        if (refNewGroup !== undefined) {
          await this.subjectSvc.createGroup(refNewGroup);
          this.groups[indexGroup].setId(refNewGroup.id);
        }
      } else {
        let refNewGroup = await this.groupSvc.transferGroup(
          this.groups[indexGroup].getId(),
          this.groups[indexPreviousGroup].getId(),
          studentId
        );
        if (refNewGroup !== undefined) {
          this.groups[indexGroup].setId(refNewGroup.id);
          await this.subjectSvc.createGroup(refNewGroup);
          //this.groups[indexGroup].getObjectDB().setLider(studentId)
        }
      }
      // if the last group is different from "withoup group"
      if (event.previousContainer.data !== this.groups[0].getObjectDB().getGrupo()) {
        const lengthPreviousGroup = event.previousContainer.data.length;
        this.verifyLeader(indexGroup, event.currentIndex, indexPreviousGroup, lengthPreviousGroup);
        await this.verifyGroupBox(indexPreviousGroup);
      } else {
        this.verifyLeader(indexGroup, -1, 0, 0);
      }
      this.verifyEmptyBoxes();
      event.container.data = this.sort(event.container.data);
    }
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }

  moveWithoutGroup(indexGroup: number, memberGroup: MemberGroup, contentDialog: any) {
    if (this.endOperation) {
      if (this.groups[indexGroup].getObjectDB().getGrupo().length === 1) {
        const dialogRef = this.dialog.open(contentDialog);
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            this.deleteSchdule(indexGroup);
            this.movewg(indexGroup, memberGroup)
          }
        });
      } else {
        this.movewg(indexGroup, memberGroup)
      }
    }
    this.endOperation = true
  }

  private movewg(indexGroup: number, memberGroup: MemberGroup) {
    this.endOperation = false
    this.groups[indexGroup].getObjectDB().setGrupo(
      this.groups[indexGroup].getObjectDB().getGrupo().filter((m: MemberGroup) => m !== memberGroup)
    );
    this.groups[0].getObjectDB().getGrupo().push(memberGroup)

    let refStudent = this.groupSvc.outGroup(this.groups[indexGroup].getId(), memberGroup.getId())
    this.subjectSvc.inStudent(refStudent)

    const indexMember = this.groups[0].getObjectDB().getGrupo().length - 1;
    this.verifyLeader(0, indexMember, indexGroup, this.groups[indexGroup].getObjectDB().getGrupo().length)
    this.verifyGroupBox(indexGroup)
    this.groups[0].getObjectDB().setGrupo(this.sort(this.groups[0].getObjectDB().getGrupo()))
    this.verifyEmptyBoxes()
  }

  deleteStudent(contentDialog: any, member: MemberGroup, indexGroup: number, contentDialogGroup: any) {
    if (this.endOperation) {
      this.endOperation = false
      this.memberToDelete = member
      const dialogRef = this.dialog.open(contentDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.groups[indexGroup].getObjectDB().getGrupo().length === 1) {
            const dialogRefGroup = this.dialog.open(contentDialogGroup);
            dialogRefGroup.afterClosed().subscribe(result => {
              if (result) {
                this.deleteSchdule(indexGroup);
                this.deleteS(member, indexGroup)
              }
            });
          } else {
            this.deleteS(member, indexGroup)
          }
        }
      });
    }
    this.endOperation = true
  }

  private deleteS(member: MemberGroup, indexGroup: number) {
    const leader = member.getId() === this.groups[indexGroup].getObjectDB().getLider() ? 1 : 0;
    this.groups[indexGroup].getObjectDB().setGrupo(
      this.groups[indexGroup].getObjectDB().getGrupo().filter((m: MemberGroup) => m !== member)
    );
    this.groupSvc.outGroup(this.groups[indexGroup].getId(), member.getId());
    this.verifyLeader(-1, leader, indexGroup, this.groups[indexGroup].getObjectDB().getGrupo().length)
    this.verifyGroupBox(indexGroup);
    this.verifyEmptyBoxes()
  }

  verifyEmptyBoxes() {
    this.groups = this.groups.filter((g) => {
      if (g.getObjectDB().getGrupo().length > 0 || g.getId() === 'SG') {
        return g;
      }
      return undefined;
    })
    this.changeDetector.markForCheck();
  }

  async verifyGroupBox(index: number) {
    if (index !== 0 && this.groups[index].getObjectDB().getGrupo().length === 0) {
      let groupToDelete = await this.subjectSvc.deleteGroup(this.groups[index].getId())
      this.groupSvc.deleteGroup(groupToDelete)
      this.groups = this.groups.filter((g) => g !== this.groups[index])
    }
  }

  verifyLeader(indexGroup: number, indexMember: number, indexPreviousGroup: number, lengthPreviousGroup: number) {
    if (indexGroup === -1) {
      if (indexMember === 1 && lengthPreviousGroup > 0) {
        let newLeader: string = this.groups[indexPreviousGroup].getObjectDB().getGrupo()[0].getId()
        this.groups[indexPreviousGroup].getObjectDB().setLider(newLeader);
        this.groupSvc.convertLeader(newLeader, this.groups[indexPreviousGroup].getId())
      }
    } else if (indexMember > -1 && lengthPreviousGroup > 0 &&
      this.groups[indexGroup].getObjectDB().getGrupo()[indexMember].getId()
      === this.groups[indexPreviousGroup].getObjectDB().getLider()) {

      let newLeader: string = this.groups[indexPreviousGroup].getObjectDB().getGrupo()[0].getId()
      this.groups[indexPreviousGroup].getObjectDB().setLider(newLeader);
      this.groupSvc.convertLeader(newLeader, this.groups[indexPreviousGroup].getId());
    }
    if (indexGroup > 0 && this.groups[indexGroup].getObjectDB().getGrupo().length === 1) {
      let newLeader: string = this.groups[indexGroup].getObjectDB().getGrupo()[0].getId();
      this.groups[indexGroup].getObjectDB().setLider(newLeader);
      //this.groupSvc.convertLeader(newLeader, this.groups[indexGroup].getId());
    }
  }

  createGroup() {
    if (this.groups[this.groups.length - 1].getId() !== 'NG') {
      let newGroup = new GroupWithNames([]);
      this.groups.push(new ObjectDB(newGroup, 'NG'));
    }
  }

  chageLeader(indexGroup: number, newLeader: string) {
    if (this.endOperation) {
      this.endOperation = false
      this.groups[indexGroup].getObjectDB().setLider(newLeader);
      this.groupSvc.convertLeader(newLeader, this.groups[indexGroup].getId());
      this.verifyEmptyBoxes();;
    }
    this.endOperation = true
  }

  deleteSchdule(indexGroup: number) {
    let groupRef = this.groupSvc.getGroupRef(this.groups[indexGroup].getId())
    this.scheduleSvc.deleteFromGroupRef(groupRef);
  }
}
