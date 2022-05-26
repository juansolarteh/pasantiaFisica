import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Usuario } from 'src/app/modelos/usuario';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialogComponent{
  @Input() person: Usuario = {
    nombre: '',
    correo: '',
    rol: ''
  }
}
