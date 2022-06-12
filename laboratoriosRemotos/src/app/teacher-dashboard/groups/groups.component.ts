import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/models/group';
import { MemberGroup } from 'src/app/models/memberGroup';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {

  groups: Group[] = []
  memberToDelete!: MemberGroup

  constructor(private readonly route: ActivatedRoute, public dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    var groups: any[] = this.route.snapshot.data['groups']
    groups.forEach(group => {
      var list: MemberGroup[] = []
      for (let idParticipant in group['team']['grupo']) {
        var memberG: MemberGroup
        if (group['team']['lider'] === idParticipant) {
          memberG = {
            id: idParticipant,
            name: group['team']['grupo'][idParticipant],
            leader: true
          }
        } else {
          memberG = {
            id: idParticipant,
            name: group['team']['grupo'][idParticipant],
            leader: false
          }
        }
        list.push(memberG)
      }
      list = this.sort(list)
      const currentGroup: Group = {
        id: group['id'],
        team: list
      }
      this.groups.push(currentGroup)
    })
  }

  sort(list: any[]) {
    list.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    })
    return list
  }

  drop(event: CdkDragDrop<MemberGroup[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const indexGroup = this.groups.findIndex((g) => g['team'] === event.container.data)
      if (event.previousContainer.data !== this.groups[0]['team']) {
        const lengthPreviousGroup = event.previousContainer.data.length;
        if (lengthPreviousGroup === 0) {
          this.groups = this.groups.filter((g) => g['team'] !== event.previousContainer.data);
        }
        const indexPreviousGroup = this.groups.findIndex((g) => g['team'] === event.previousContainer.data)
        this.verifyLeader(indexGroup, event.currentIndex, indexPreviousGroup, lengthPreviousGroup);
      }else{
        this.verifyLeader(indexGroup, -1, 0, 0);
      }
      event.container.data = this.sort(event.container.data)
    }
  }

  moveWithoutGroup(indexGroup: number, memberGroup: MemberGroup) {
    this.groups[indexGroup]['team'] = this.groups[indexGroup]['team'].filter((m: MemberGroup) => m !== memberGroup)
    this.groups[0]['team'].push(memberGroup)
    const indexMember = this.groups[0]['team'].length - 1;
    this.verifyLeader(0, indexMember, indexGroup, this.groups[indexGroup]['team'].length)
    this.verifyGroupBox(indexGroup)
    this.groups[0]['team'] = this.sort(this.groups[0]['team'])
  }

  deleteStudent(contentDialog: any, member: MemberGroup, indexGroup: number) {
    this.memberToDelete = member
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const leader = member.leader? 1: 0;
        this.groups[indexGroup]['team'] = this.groups[indexGroup]['team'].filter((m: MemberGroup) => m !== member)
        this.verifyLeader(-1, leader, indexGroup, this.groups[indexGroup]['team'].length)
        this.verifyGroupBox(indexGroup)
        this.changeDetector.markForCheck();
      }
    });
  }

  verifyGroupBox(index: number) {
    if (index !== 0 && this.groups[index]['team'].length === 0) {
      this.groups = this.groups.filter((g) => g['team'] !== this.groups[index]['team'])
    }
  }

  verifyLeader(indexGroup: number, indexMember: number, indexPreviousGroup: number, lengthPreviousGroup: number) {
    if (indexGroup === -1) {
      if (indexMember === 1 && lengthPreviousGroup > 0) {
        this.groups[indexPreviousGroup]['team'][0]['leader'] = true
      }
    } else if (indexMember > -1 && this.groups[indexGroup]['team'][indexMember]['leader']) {
      this.groups[indexGroup]['team'][indexMember]['leader'] = false
      if (lengthPreviousGroup > 0) {
        this.groups[indexPreviousGroup]['team'][0]['leader'] = true
      }
    }
    if (indexGroup > 0 && this.groups[indexGroup]['team'].length === 1){
      this.groups[indexGroup]['team'][0]['leader'] = true
    }
  }

  createGroup() {
    const newGroup: Group = {
      id: '',
      team: []
    }
    this.groups.push(newGroup)
  }

  chageLeader(indexGroup: number, indexMember: number) {
    if (!this.groups[indexGroup]['team'][indexMember]['leader']) {
      for (let positionMember in this.groups[indexGroup]['team']) {
        if (this.groups[indexGroup]['team'][positionMember]['leader']) {
          this.groups[indexGroup]['team'][positionMember]['leader'] = false;
          break;
        }
      }
      this.groups[indexGroup]['team'][indexMember]['leader'] = true;
    }
  }
}
