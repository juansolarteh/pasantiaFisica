import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GroupWithNames } from 'src/app/models/Group';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { GroupsService } from 'src/app/services/groups.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {

  groups: ObjectDB<GroupWithNames>[] = []
  memberToDelete!: MemberGroup

  constructor(private readonly route: ActivatedRoute, public dialog: MatDialog, private subjectSvc: SubjectService,
    private changeDetector: ChangeDetectorRef, private groupSvc: GroupsService) { }

  ngOnInit(): void {
    this.groups = this.route.snapshot.data['groups'];
    let sg: ObjectDB<GroupWithNames> = this.route.snapshot.data['withoutGroup'];
    let aux = this.groups[0];
    this.groups[0] = sg;
    this.groups.push(aux);
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

  drop(event: CdkDragDrop<MemberGroup[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const indexGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.container.data);
      const indexPreviousGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.previousContainer.data);
      const studentId: string = this.groups[indexGroup].getObjectDB().getGrupo()[event.currentIndex].getId();
      if (indexGroup === 0){
        this.subjectSvc.moveStudent(studentId)
        this.groupSvc.outGroup(this.groups[indexPreviousGroup].getId(), studentId)
      }else{
        this.groupSvc.transferStudent(this.groups[indexPreviousGroup].getId(), this.groups[indexGroup].getId(), studentId)
      }
      // if the last group is different from "withoup group"
      if (event.previousContainer.data !== this.groups[0].getObjectDB().getGrupo()) {
        const lengthPreviousGroup = event.previousContainer.data.length;
        if (lengthPreviousGroup === 0) {
          let emptyGroup = this.groups.find((g) => g.getObjectDB().getGrupo() === event.previousContainer.data)
          this.groupSvc.deleteGroup(emptyGroup?.getId()!)
          this.groups = this.groups.filter((g) => g.getObjectDB().getGrupo() !== event.previousContainer.data);
        }
        this.verifyLeader(indexGroup, event.currentIndex, indexPreviousGroup, lengthPreviousGroup);
      } else {
        this.verifyLeader(indexGroup, -1, 0, 0);
      }
      event.container.data = this.sort(event.container.data)
    }
  }

  moveWithoutGroup(indexGroup: number, memberGroup: MemberGroup) {
    this.groups[indexGroup].getObjectDB().setGrupo(
      this.groups[indexGroup].getObjectDB().getGrupo().filter((m: MemberGroup) => m !== memberGroup)
    );
    this.groups[0].getObjectDB().getGrupo().push(memberGroup)
    
    const indexMember = this.groups[0].getObjectDB().getGrupo().length - 1;
    this.verifyLeader(0, indexMember, indexGroup, this.groups[indexGroup].getObjectDB().getGrupo().length)
    this.verifyGroupBox(indexGroup)
    this.groups[0].getObjectDB().setGrupo(this.sort(this.groups[0].getObjectDB().getGrupo()))
  }

  deleteStudent(contentDialog: any, member: MemberGroup, indexGroup: number) {
    this.memberToDelete = member
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const leader = member.getId() === this.groups[indexGroup].getObjectDB().getLider() ? 1 : 0;
        this.groups[indexGroup].getObjectDB().setGrupo(
          this.groups[indexGroup].getObjectDB().getGrupo().filter((m: MemberGroup) => m !== member)
        );
        this.verifyLeader(-1, leader, indexGroup, this.groups[indexGroup].getObjectDB().getGrupo().length)
        this.verifyGroupBox(indexGroup)
        this.changeDetector.markForCheck();
      }
    });
  }

  verifyGroupBox(index: number) {
    if (index !== 0 && this.groups[index].getObjectDB().getGrupo().length === 0) {
      this.groups = this.groups.filter((g) => g.getObjectDB().getGrupo() !== this.groups[index].getObjectDB().getGrupo())
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
      if (lengthPreviousGroup > 0) {
        let newLeader: string = this.groups[indexPreviousGroup].getObjectDB().getGrupo()[0].getId()
        this.groups[indexPreviousGroup].getObjectDB().setLider(newLeader);
        this.groupSvc.convertLeader(newLeader, this.groups[indexPreviousGroup].getId())
      }
    }
    if (indexGroup > 0 && this.groups[indexGroup].getObjectDB().getGrupo().length === 1) {
      let newLeader: string = this.groups[indexGroup].getObjectDB().getGrupo()[0].getId()
      this.groups[indexGroup].getObjectDB().setLider(newLeader);
    }
  }

  createGroup() {
    let newGroup = new GroupWithNames([]);
    this.groups.push(new ObjectDB(newGroup, 'NG'))
  }

  chageLeader(indexGroup: number, newLeader: string) {
    this.groups[indexGroup].getObjectDB().setLider(newLeader);
  }
}
