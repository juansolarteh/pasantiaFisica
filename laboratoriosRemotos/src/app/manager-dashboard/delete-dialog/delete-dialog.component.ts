import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from 'src/app/modelos/user';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent{
  @Input() person: User = {
    name: '',
    email: '',
    rol: ''
  }
}
