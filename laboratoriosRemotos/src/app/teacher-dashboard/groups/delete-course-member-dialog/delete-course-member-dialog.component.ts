import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MemberGroup } from 'src/app/models/MemberGroup';

@Component({
  selector: 'app-delete-course-member-dialog',
  templateUrl: './delete-course-member-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCourseMemberDialogComponent {

  @Input() memberGroup!: MemberGroup;
}
