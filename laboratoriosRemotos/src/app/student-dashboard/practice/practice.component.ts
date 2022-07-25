import { Subject } from 'src/app/models/Subject'
import { SubjectService } from 'src/app/services/subject.service';
import { Practice } from 'src/app/models/Practice';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeService } from 'src/app/services/practice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, get, ref, set, child } from 'firebase/database';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }
  practiceSelected!: ObjectDB<Practice>
  subjectSelected!: ObjectDB<Subject>

  ngOnInit(): void {
    this.practiceSelected = this.activatedRoute.snapshot.data['practiceSelected']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']

  }

  iniciarStreaming(){
    const dbref = ref(getDatabase());
    get(child(dbref, "StreamCaidaLibre"))
      .then((snapshot) => {
        console.log(snapshot.val().estado);
        if (snapshot.val().estado == 0) {
          set(ref(getDatabase(), 'StreamCaidaLibre'), {
            estado: 1,
            url: snapshot.val().url,
            cerrar: 0
          });
        }
      });
      setTimeout(this.navigateToPracticeExecution.bind(this),2000)
    //TO-DO: Colocar delay para redireccionar a la vista de practica en ejecucion
    
  }
  private navigateToPracticeExecution(){
    this.router.navigate(['../../practice-execution'], {relativeTo: this.activatedRoute})
  }

}