import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { SubjectUltimo } from 'src/app/models/SubjectUltimo';

interface subjectShow{
  id:string,
  name:string
}

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectsComponent implements OnInit {

  subjects: subjectShow[] = [];

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    const subjects: ObjectDB<SubjectUltimo>[] = this.route.snapshot.data['subjects']
    subjects.forEach(subject => {
      let sub: subjectShow = {
        id: subject.getId(),
        name: subject.getObjectDB().getNombre(),
      }
      this.subjects.push(sub);
    })
  }

  goToSubject(subjectId: string) {
    this.router.navigate(['../subject', subjectId], { relativeTo: this.route })
  }
}
