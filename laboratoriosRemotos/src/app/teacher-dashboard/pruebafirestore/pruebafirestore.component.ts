import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PlantService } from 'src/app/services/plant.service';
import { PracticeService } from 'src/app/services/practice.service';

@Component({
  selector: 'app-pruebafirestore',
  templateUrl: './pruebafirestore.component.html',
  styleUrls: ['./pruebafirestore.component.css']
})
export class PruebafirestoreComponent implements OnInit {

  nameDB = '/plantas'
  plantName = 'Ley de Hooke'
  plantRef!: AngularFireList<any>

  constants: ObjectDB<number[]>[] = []
  units: any = [];
  range: any;

  practiceForm!: FormGroup;

  constructor(
    private db: AngularFireDatabase,
    private plantSvc: PlantService,
    private practiceSvc: PracticeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.practiceForm = this.fb.group({})
    this.plantRef = this.db.list(this.nameDB)
    this.plantRef.valueChanges(['child_changed']).subscribe(event => {
      if (event[0].terminado) {
        console.log('Acabo la maquina')
        console.log('Automaticamente en este proceso se cambia terminado a false')
        console.log('Este es el resultado => ', event[0].resultado)
        this.plantRef.update(this.plantName, {
          terminado: false,
        })
      }
    })
  }

  getPlant(plantId: string, practiceId: string) {
    this.plantSvc.getPlant(this.plantSvc.getPlantRefFromId(plantId)).then(plant => {
      this.plantName = plant.getNombre()
      this.practiceSvc.getConstantsPractice(practiceId).then(cons => {
        this.range = plant.getRango();
        this.units = plant.getUnidades()
        this.constants = cons;
        this.practiceForm = this.initForm()
      });   
    })
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
      Object.defineProperty(obj, cons.getId(), {value: value, enumerable: true})
    })
    this.plantRef.update(this.plantName, obj).then(() => {
      this.plantRef.update(this.plantName, {iniciar: true})
    })
  }

  termimaMaquina() {
    this.plantRef.update(this.plantName, {
      iniciar: false,
      resultado: 25,
      terminado: true,
    })
  }
}
