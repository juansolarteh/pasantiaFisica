import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MemberGroup } from 'src/app/modelos/memberGroup';
import { GruposService } from 'src/app/servicios/grupos.service';

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

  constructor(private groupSvc: GruposService) { }
}
