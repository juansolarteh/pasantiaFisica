import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  docentes: Usuario[] = []
  laboratoristas: Usuario[] = []
  addUserRol = ''
  dialogRef: MatDialogRef<unknown, any> | undefined

  constructor(public dialog: MatDialog, private readonly route: ActivatedRoute, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    const workers: Usuario[] = this.route.snapshot.data['workers']
    this.docentes = workers.filter((i) => i.rol !== 'Laboratorista')
    this.laboratoristas = workers.filter((i) => i.rol !== 'Docente')
  }

  deleteUser(user: Usuario) {
    if (user['rol'] === 'Docente') {
      this.docentes = this.docentes.filter((i) => i !== user);
    } else {
      this.laboratoristas = this.laboratoristas.filter((i) => i !== user);
    }
  }

  onAddUser(contentDialog: any, rol: string) {
    this.addUserRol = rol
    this.dialogRef = this.dialog.open(contentDialog);
  }

  closeAddDialog(usuario: Usuario) {
    const falsoUsuario: Usuario = new Usuario()
    this.dialogRef?.close()
    if (this.addUserRol === 'Docente'){
      this.docentes.push(usuario)
      this.docentes = this.docentes.filter((i) => i !== falsoUsuario);
    }else{
      this.laboratoristas.push(usuario)
      this.laboratoristas = this.laboratoristas.filter((i) => i !== falsoUsuario);
    }
    this.changeDetector.markForCheck();
  }
}
