import { Subscription } from 'rxjs';
import { PracticeExecution } from './../../models/PracticeExecution';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, get, ref, set, child } from 'firebase/database';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';


@Component({
  selector: 'app-practice-execution',
  templateUrl: './practice-execution.component.html',
  styleUrls: ['./practice-execution.component.css']
})
export class PracticeExecutionComponent implements OnInit, OnDestroy {


  nameDB = '/plantas'
  plantName = ''
  plantRef!: AngularFireList<any>
  constants: ObjectDB<number[]>[] = []
  units: any = [];
  range: any;
  practiceForm!: FormGroup;
  src = ''
  suscription! : Subscription

  constructor(private plantSvc: PlantService,
    private practiceSvc: PracticeService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,private db: AngularFireDatabase) { }

  ngOnDestroy(): void {
    this.suscription.unsubscribe()
  }
  
  ngOnInit(): void {
    let data: PracticeExecution = this.activatedRoute.snapshot.data['practiceExecution']
    this.range = data.range
    this.units = data.units
    this.constants = data.constants!
    this.plantName = data.plantName
    this.practiceForm = this.initForm()
    this.plantRef = this.db.list(this.nameDB)
    this.suscription = this.plantRef.valueChanges(['child_changed']).subscribe(event => {
      if (event[0].terminado) {
        console.log('Acabo la maquina')
        console.log('Automaticamente en este proceso se cambia terminado a false')
        console.log('Este es el resultado => ', event[0].resultado)
        this.plantRef.update(this.plantName, {
          terminado: false,
        })
      }
    })
    const dbref = ref(getDatabase());
    get(child(dbref, "Stream" + data.id))
      .then((snapshot) => {
        this.src = snapshot.val().url;
        this.iniciarStreaming(this.src);
      });
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

  finalizarPractica() {
    const dbref = ref(getDatabase());
    set(ref(getDatabase(), 'StreamCaidaLibre'), {
      estado: 0,
      cerrar: 1,
      url: this.src
    });
  }
  initForm(): FormGroup {
    let form = this.fb.group({})
    let keys = Object.keys(this.units);
    keys.forEach(k => {
      if (this.range) {
        if (this.range[k]) {
          let cons = this.constants.find(c => c.getId() === k)
          let min = cons?.getObjectDB()[0]!
          let max = cons?.getObjectDB()[1]!
          form.addControl(k, new FormControl('', [Validators.required, Validators.min(min), Validators.max(max)]))
        } else {
          form.addControl(k, new FormControl('', Validators.required))
        }
      } else {
        form.addControl(k, new FormControl('', Validators.required))
      }
    })
    return form
  }

  sliderChange(value: number, nameControl: string) {
    this.practiceForm.get(nameControl)?.setValue(value)
  }


  startPlant() {
    let obj: Object = new Object();
    console.log(this.constants)
    this.constants.forEach(cons => {
      let value = this.practiceForm.get(cons.getId())?.value
      Object.defineProperty(obj, cons.getId(), { value: value, enumerable: true })
    })
    this.plantRef.update(this.plantName, obj).then(() => {
      this.plantRef.update(this.plantName, { iniciar: true })
    })
  }

  stopPlant() {
    this.plantRef.update(this.plantName, {
      iniciar: false,
      resultado: 25,
      terminado: true,
    })
  }
}
