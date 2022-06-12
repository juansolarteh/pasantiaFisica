import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent{
  @Input() user!: User;
}
