import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { child, get, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-practice-teacher-execution',
  templateUrl: './practice-teacher-execution.component.html',
  styleUrls: ['./practice-teacher-execution.component.css']
})
export class PracticeTeacherExecutionComponent implements OnInit {

  group!: string[]
  src!: string

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.group = this.route.snapshot.data['group'];
    this.route.params.subscribe(data => {
      const plantId = data['plantid'];
      const dbref = ref(getDatabase());
      get(child(dbref, "Stream" + plantId)).then((snapshot) => {
        this.src = snapshot.val().url
        this.iniciarStreaming(this.src)
      });
    })
  }

  iniciarStreaming(url: string) {
    var x = document.createElement("IFRAME");
    x.style.width = "100%";
    x.style.height = "100%";
    x.setAttribute("src", url);
    let iframe = document.getElementById("iframe")!
    iframe.innerHTML = ''
    iframe.appendChild(x);
  }
}
