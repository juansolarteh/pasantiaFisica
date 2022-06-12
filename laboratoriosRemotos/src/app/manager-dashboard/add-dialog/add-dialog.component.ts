import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDialogComponent {

  @Input() rol: string = '';
  email = new FormControl('', [Validators.required, Validators.email, Validators.pattern(('[^]*(unicauca.edu.co)'))]);
  @Output() addUser: EventEmitter<ObjectDB<User>> = new EventEmitter();

  constructor(private userSvc: UserService, private _snackBar: MatSnackBar) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes llenar el campo';
    }
    if (this.email.hasError('email')) {
      return 'No es un email valido';
    }
    return this.email.hasError('pattern') ? 'El dominio debe pertenecer a Unicauca' : '';
  }

  onAddUSer() {
    var user: User = new User('', this.email.value, this.rol);
    const promise = this.userSvc.addUser(user);
    promise.then(response =>{
      if (response.isApproved()){
        let id = response.getObject();
        if (id){
          this.addUser.emit(new ObjectDB<User>(user, id));
        }
      }else{
        this.openSnackBar(response.getMessage());
        this.email.setValue('');
      }
    });
  }
  
  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000);
  }

}
