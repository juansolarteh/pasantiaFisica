import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { getDatabase, get, ref, set, child } from 'firebase/database';

@Component({
  selector: 'app-practice-execution',
  templateUrl: './practice-execution.component.html',
  styleUrls: ['./practice-execution.component.css']
})
export class PracticeExecutionComponent implements OnInit, AfterContentChecked {


  constructor() { }
  
  
  src = ''

  ngOnInit(): void {
    const dbref = ref(getDatabase());
    get(child(dbref, "StreamCaidaLibre"))
      .then((snapshot) => {
        this.src = snapshot.val().url;
        this.iniciarStreaming(this.src);
      });
  }
  ngAfterContentChecked(): void {
    
  }

  iniciarStreaming(url: string) {
    var x = document.createElement("IFRAME");
    x.style.width = "720px";
    x.style.height = "480px";
    x.setAttribute("src", url);
    let iframe = document.getElementById("iframe")!
    iframe.innerHTML = ''
    iframe.appendChild(x);
  }

  finalizarPractica(){
    const dbref = ref(getDatabase());
		set(ref(getDatabase(), 'StreamCaidaLibre'), {
			estado: 0,
			cerrar: 1,
			url: this.src
		});

  }
}
