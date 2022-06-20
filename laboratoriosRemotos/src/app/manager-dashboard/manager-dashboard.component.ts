import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectDB } from '../models/ObjectDB';
import { User } from '../models/User';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerDashboardComponent implements OnInit {
  teachers: ObjectDB<User>[] = [];
  laboratorians: ObjectDB<User>[] = [];
  addUserRol = '';
  dialogRef: MatDialogRef<unknown, any> | undefined;

  constructor(private dialog: MatDialog, private readonly route: ActivatedRoute, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    const users: ObjectDB<User>[] = this.route.snapshot.data['users'];
    this.teachers = users.filter((user) => user.getObjectDB().getRol() !== 'Laboratorista');
    this.laboratorians = users.filter((user) => user.getObjectDB().getRol() !== 'Docente');
  }

  deleteUser(user: ObjectDB<User>) {
    if (user.getObjectDB().getRol() === 'Docente') {
      this.teachers = this.teachers.filter((teacher) => teacher !== user);
    } else {
      this.laboratorians = this.laboratorians.filter((laboratorian) => laboratorian !== user);
    }
  }

  onAddUser(contentDialog: any, rol: string) {
    this.addUserRol = rol;
    this.dialogRef = this.dialog.open(contentDialog);
  }

  closeAddDialog(user: ObjectDB<User>) {
    this.dialogRef?.close();
    if (this.addUserRol === 'Docente'){
      this.teachers.push(user);
    }else{
      this.laboratorians.push(user);
    }
    this.changeDetector.markForCheck();
  }
}
