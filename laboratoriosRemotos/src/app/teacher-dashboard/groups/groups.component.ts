import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MemberGroup } from 'src/app/modelos/memberGroup';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent implements OnInit {

  groups: any[][] = []
  leaders: string[] = []
  memberToDelete!: MemberGroup

  constructor(private readonly route: ActivatedRoute, public dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    var groups: any[] = this.route.snapshot.data['groups']
    groups.forEach(group => {
      if (group['lider']) {
        this.leaders.push(group['lider'])
      }
      var list: MemberGroup[] = []
      for (let idParticipant in group['grupo']) {
        const part: MemberGroup = {
          id: idParticipant,
          name: group['grupo'][idParticipant]
        }
        list.push(part)
      }
      this.groups.push(list)
    })
    //Falta pintar el lider
    //groups.forEach(group => {
    //  if (!group['lider'])
    //})
  }

  drop(event: CdkDragDrop<MemberGroup[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  moveWithoutGroup(indexGroup: number, memberGroup: MemberGroup) {
    this.groups[indexGroup] = this.groups[indexGroup].filter((m) => m !== memberGroup)
    this.groups[0].push(memberGroup)
    console.log(this.groups)
  }

  deleteMember(contentDialog: any, member: MemberGroup, indexGroup: number) {
    this.memberToDelete = member
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groups[indexGroup] = this.groups[indexGroup].filter((m) => m !== member)
        this.changeDetector.markForCheck();
      }
    });
  }

  createGroup(){
    const newList: MemberGroup[] = []
    this.groups.push(newList)
  }
}
