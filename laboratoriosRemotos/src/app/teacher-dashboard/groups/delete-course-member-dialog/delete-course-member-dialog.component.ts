import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-delete-course-member-dialog',
  templateUrl: './delete-course-member-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCourseMemberDialogComponent {

  @Input() memberGroup: MemberGroup = {
    name: '',
    id: '',
    leader: false
  }

  constructor(private groupSvc: GroupsService) { }
}
