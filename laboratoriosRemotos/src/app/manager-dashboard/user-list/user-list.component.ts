import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { User } from 'src/app/models/User';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SubjectService } from 'src/app/services/subject.service';
import { GroupsService } from 'src/app/services/groups.service';
import { PracticeService } from 'src/app/services/practice.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() titleList: string = ''
  @Input() userList: ObjectDB<User>[] = []
  @Output() deleteUser: EventEmitter<ObjectDB<User>> = new EventEmitter();
  deletedUser!: ObjectDB<User>;

  constructor(
    public dialog: MatDialog,
    private userSvc: UserService,
    private practiceSvc: PracticeService,
    private scheduleSvc: ScheduleService,
    private subjectSvc: SubjectService,
    private groupSvc: GroupsService
  ) { }

  delete(contentDialog: any, user: ObjectDB<User>) {
    this.deletedUser = user;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const userRef = this.userSvc.getRefUser(user.getId());
        const subjectsRef = await this.subjectSvc.getRefSubjectsFromRefUser(userRef);
        let practicesRef: DocumentReference[] = [];
        let groupsRef: DocumentReference[] = [];
        subjectsRef.forEach(async subRef => {
          practicesRef = practicesRef.concat(await this.practiceSvc.getPracticesRefFromSubjectRef(subRef));
          groupsRef = groupsRef.concat(await this.subjectSvc.getRefGroupsFromSubjectId(subRef.id))
          this.subjectSvc.deleteFromReference(subRef);
        });
        practicesRef.forEach(prtRef => {
          this.scheduleSvc.deleteFromPracticeReference(prtRef);
          this.practiceSvc.delete(prtRef);
        });
        groupsRef.forEach(group => {
          this.groupSvc.deleteGroup(group);
        });
        this.userSvc.deleteUser(userRef);
        this.deleteUser.emit(this.deletedUser);
      }
    });
  }
}
