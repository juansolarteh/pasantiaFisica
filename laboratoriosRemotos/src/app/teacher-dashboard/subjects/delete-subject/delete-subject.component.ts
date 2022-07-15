import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-subject',
  templateUrl: './delete-subject.component.html',
  styleUrls: ['./delete-subject.component.css']
})
export class DeleteSubjectComponent{

  @Input() subjectName!: string;

}
