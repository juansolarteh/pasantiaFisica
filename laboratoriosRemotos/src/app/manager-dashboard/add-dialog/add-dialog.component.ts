import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/modelos/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDialogComponent {

  @Input() rol: string = ''
  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern(('[^]*(unicauca.edu.co)'))]);
  @Output() addUser: EventEmitter<Usuario> = new EventEmitter();

  constructor(private userSvc: UsuarioService, private _snackBar: MatSnackBar) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes llenar el campo';
    }
    if (this.email.hasError('email')) {
      return 'No es un email valido'
    }
    return this.email.hasError('pattern') ? 'El dominio debe pertenecer a Unicauca' : '';
  }

  onAddUSer() {
    const usuario: Usuario = {
      nombre: '',
      correo: this.email.value,
      rol: this.rol
    }
    const promise = this.userSvc.addUser(usuario)
    promise.then(response =>{
      if (response.approved){
        this.addUser.emit(usuario)
      }else{
        this.openSnackBar(response.message)
        this.email.setValue('')
      }
    })
  }
  
  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }

}
