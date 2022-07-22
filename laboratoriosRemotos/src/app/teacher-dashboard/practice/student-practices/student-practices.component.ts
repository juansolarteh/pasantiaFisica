import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Practice } from 'src/app/models/Practice';

@Component({
  selector: 'app-student-practices',
  templateUrl: './student-practices.component.html',
  styleUrls: ['./student-practices.component.css']
})
export class StudentPracticesComponent implements OnInit {

  groups: ObjectDB<GroupWithNames>[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.groups = this.route.snapshot.data['groups'];
  }

  event: any;
  cargarEvento(eAux: any) {
    this.event = eAux;
  }

  base(){
    let archivos = this.event.target.files;
    let aux;
    for (let index = 0; index < archivos.length; index++) {
      let reader = new FileReader();
      reader.readAsDataURL(archivos[index]);
      reader.onloadend = () => {
        console.log(reader.result)
      }
    }
  }

}
