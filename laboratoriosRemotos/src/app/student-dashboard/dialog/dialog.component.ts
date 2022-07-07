import { ActivatedRoute } from '@angular/router';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @ViewChild('btnSetLeader') btnSetLeader!: MatButton

  leaderSelected!: MemberGroup
  constructor(@Inject(MAT_DIALOG_DATA) public data: {selectedGroup:MemberGroup[],currentUser:MemberGroup}, private _snackBar: MatSnackBar) { }

  onLeaderSelected : EventEmitter<MemberGroup> = new EventEmitter<MemberGroup>()

  ngOnInit(): void {
    //this.currentUser = this.activatedRoute.snapshot.data['currentUser']
    
  }
  onLeaderChange(leader: MemberGroup){
    this.btnSetLeader.disabled = false
  }
  onGoToSelectLeader(){
    this.onLeaderSelected.emit(this.leaderSelected)
  }
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }
}
