import { Subscription } from 'rxjs';
import { PracticeExecution } from './../../models/PracticeExecution';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, get, ref, set, child } from 'firebase/database';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-practice-execution',
  templateUrl: './practice-execution.component.html',
  styleUrls: ['./practice-execution.component.css']
})
export class PracticeExecutionComponent implements OnInit, OnDestroy {


  nameDB = '/plantas'
  plantName = ''
  plantRef!: AngularFireObject<any>
  constants: ObjectDB<number[]>[] = []
  units: any = [];
  range: any;
  practiceForm!: FormGroup;
  src = ''
  suscription!: Subscription
  stream!: string

  close!: boolean
  processing!: boolean

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private db: AngularFireDatabase,
    private _snackBar: MatSnackBar
  ) { }

  ngOnDestroy(): void {
    this.suscription.unsubscribe()
  }

  ngOnInit(): void {
    let data: PracticeExecution = this.activatedRoute.snapshot.data['practiceExecution']
    this.close = false;
    this.processing = false;
    this.stream = 'Stream' + data.id
    this.range = data.range
    this.units = data.units
    this.constants = data.constants!
    this.plantName = data.plantName
    this.practiceForm = this.initForm()
    this.plantRef = this.db.object('/plantas/' + this.plantName)
    this.suscription = this.plantRef.valueChanges().subscribe(event => {
      if (event.terminado) {
        console.log('Acabo la maquina')
        console.log('Automaticamente en este proceso se cambia terminado a false')
        console.log('Este es el resultado => ', event.resultado)
        this.plantRef.update({
          terminado: false,
        }).then(() => {this.processing = false})
      }
    })

    const dbref = ref(getDatabase());
    get(child(dbref, this.stream)).then((snapshot) => {
      this.src = snapshot.val().url;
      this.iniciarStreaming(this.src);
    });

    let nextBlock = moment().add(1, 'h')
    nextBlock = moment(nextBlock.format('YYYY-MM-DD HH:00:00'))
    let alertEnd = nextBlock.subtract(3, 'minutes').diff(moment(), 'seconds')

    setTimeout(() => {
      this.openSnackBar('La practica pronto terminara, no es posible realizar mas ejecuciones')
      this.close = true
      setTimeout(() => {
        this.openSnackBar('La practica ha finalizado')
        this.finalizarPractica()
      }, 175000)
    }, alertEnd * 1000)
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
    set(ref(getDatabase(), this.stream), {
      estado: 0,
      cerrar: 1,
      url: this.src
    }).then(() => { this.router.navigate(['/'], { relativeTo: this.route }) });
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
    this.constants.forEach(cons => {
      let value = this.practiceForm.get(cons.getId())?.value
      Object.defineProperty(obj, cons.getId(), { value: value, enumerable: true })
    })
    this.plantRef.update(obj).then(() => {
      this.plantRef.update({ iniciar: true }).then(() => {
        this.processing = true
      })
    })
  }

  stopPlant() {
    this.plantRef.update({
      iniciar: false,
      resultado: 25,
      terminado: true,
    })
  }
  getErrorMessage(field: string) {
    if (this.practiceForm.get(field)?.errors?.['required']) {
      return 'Debes llenar el campo';
    } else if (this.practiceForm.get(field)?.errors?.['min']) {
      let cons = this.constants.find(c => c.getId() === field)
      let min = cons?.getObjectDB()[0]!
      return 'El campo no puede ser menor a ' + min;
    } else if (this.practiceForm.get(field)?.errors?.['max']) {
      let cons = this.constants.find(c => c.getId() === field)
      let max = cons?.getObjectDB()[1]!
      return 'El campo no puede ser mayor a ' + max;
    }
    return ""
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }
}
