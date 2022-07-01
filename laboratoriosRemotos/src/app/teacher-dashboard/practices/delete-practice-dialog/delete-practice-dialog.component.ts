import { Component, Input } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeNameDate } from 'src/app/models/Practice';

@Component({
  selector: 'app-delete-practice-dialog',
  templateUrl: './delete-practice-dialog.component.html'
})
export class DeletePracticeDialogComponent{
  @Input() practice!: ObjectDB<PracticeNameDate>;
}
