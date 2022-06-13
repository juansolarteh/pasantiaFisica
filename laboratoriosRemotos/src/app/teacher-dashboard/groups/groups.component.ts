import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Group, GroupWithNames } from 'src/app/models/Group';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { ObjectDB } from 'src/app/models/ObjectDB';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {

  groups: ObjectDB<GroupWithNames>[] = []
  memberToDelete!: MemberGroup

  constructor(private readonly route: ActivatedRoute, public dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.groups = this.route.snapshot.data['groups'];
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
      const indexGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.container.data)
      if (event.previousContainer.data !== this.groups[0].getObjectDB().getGrupo()) {
        const lengthPreviousGroup = event.previousContainer.data.length;
        if (lengthPreviousGroup === 0) {
          this.groups = this.groups.filter((g) => g.getObjectDB().getGrupo() !== event.previousContainer.data);
        }
        const indexPreviousGroup = this.groups.findIndex((g) => g.getObjectDB().getGrupo() === event.previousContainer.data)
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
        const leader = member.getRefUser() === this.groups[indexGroup].getObjectDB().getLider() ? 1 : 0;
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
        let newLeader: DocumentReference = this.groups[indexPreviousGroup].getObjectDB().getGrupo()[0].getRefUser()
        this.groups[indexPreviousGroup].getObjectDB().setLider(newLeader);
      }
    } else if (indexMember > -1 &&
      this.groups[indexGroup].getObjectDB().getGrupo()[indexMember].getRefUser()
      === this.groups[indexGroup].getObjectDB().getLider()) {
      if (lengthPreviousGroup > 0) {
        let newLeader: DocumentReference = this.groups[indexPreviousGroup].getObjectDB().getGrupo()[0].getRefUser()
        this.groups[indexPreviousGroup].getObjectDB().setLider(newLeader);
      }
    }
    if (indexGroup > 0 && this.groups[indexGroup].getObjectDB().getGrupo().length === 1) {
      let newLeader: DocumentReference = this.groups[indexGroup].getObjectDB().getGrupo()[0].getRefUser()
      this.groups[indexGroup].getObjectDB().setLider(newLeader);
    }
  }

  createGroup() {
    let newGroup = new GroupWithNames(true, []);
    this.groups.push(new ObjectDB(newGroup, ''))
  }

  chageLeader(indexGroup: number, newLeader: DocumentReference) {
    this.groups[indexGroup].getObjectDB().setLider(newLeader);
  }
}
