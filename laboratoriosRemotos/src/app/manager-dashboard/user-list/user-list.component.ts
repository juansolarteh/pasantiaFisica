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
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input() titleList: string = ''
  @Input() userList: ObjectDB<User>[] = []
  @Output() deleteUser: EventEmitter<ObjectDB<User>> = new EventEmitter();
  deletedUser!: ObjectDB<User>;

  constructor(public dialog: MatDialog, private userSvc: UserService, private groupSvc: GroupsService,
    private practiceSvc: PracticeService, private scheduleSvc: ScheduleService, private subjectSvc: SubjectService) { }

  delete(contentDialog: any, user: ObjectDB<User>) {
    this.deletedUser = user;
    const dialogRef = this.dialog.open(contentDialog);
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const userRef = this.userSvc.getRefUser(user.getId());
        const subjectsRef = await this.subjectSvc.getRefSubjectsFromRefUser(userRef);
        var practicesaRef: DocumentReference[] = [];
        subjectsRef.forEach(async subRef => {
          practicesaRef = practicesaRef.concat(await this.practiceSvc.getPracticesRefFromSubjectRef(subRef));
          this.subjectSvc.deleteFromReference(subRef);
        });
        practicesaRef.forEach(prtRef => {
          this.scheduleSvc.deleteFromPracticaReference(prtRef);
          this.practiceSvc.delete(prtRef);
        });
        this.userSvc.deleteUser(userRef);
        this.deleteUser.emit(this.deletedUser);
      }
    });
  }
}
