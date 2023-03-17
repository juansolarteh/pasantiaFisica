import { UserService } from './../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportAnomalyComponent } from './../report-anomaly/report-anomaly.component';
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GroupWithNames } from 'src/app/models/Group';
import { Subject } from 'src/app/models/Subject';
import { Practice } from 'src/app/models/Practice';
import { ScheduleService } from 'src/app/services/schedule.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  pdfData: {}[] = []
  close!: boolean
  processing!: boolean
  finished!: boolean
  repResult: string = ''
  studentGroup!: ObjectDB<GroupWithNames>
  subjectSelected!: ObjectDB<Subject>
  practiceSelected!: ObjectDB<Practice>

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute, private db: AngularFireDatabase,
    private _snackBar: MatSnackBar,
    public dialogReportAnomaly: MatDialog,
    private readonly router: Router,
    private userSvc : UserService, private scheduleSvc: ScheduleService
  ) { }

  ngOnDestroy(): void {
    this.suscription.unsubscribe()
    
  }

  /**
   * En este método es donde se inicializa la vista de práctica en ejecución, es en este punto donde se conoce
   * que planta es la que está en ejecución y por ende tambien se conocen sus constantes, unidades, campos de entrada y de salida.
   */
  ngOnInit(): void {
    let data: PracticeExecution = this.activatedRoute.snapshot.data['practiceExecution']
    this.practiceSelected = this.activatedRoute.snapshot.data['practiceSelected'];
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.finished = false
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
      if (event.Terminado === 1) {
        console.log('---- SIMULACIÓN -----')
        console.log('Automaticamente en este proceso se cambia Terminado a 1')
        console.log('Ha finalizado la repetición... El resultado es: ' + event.Resultado)
        this.repResult = event.Resultado
        let objAux = {}
        Object.entries(event).forEach(([key, value]) => {
          if (key != 'Inicio' && key != 'Terminado') {
            objAux[key] = value
          }
        })
        //this.processing = false 
        this.pdfData.push(objAux)
        this.plantRef.update({
          Terminado : 0
        })
        /* this.plantRef.update({
          Terminado: 0,
        }).then(() => { this.processing = false }) */
      }
    })

    //Se obtiene la referencia de la Realtime para establecer la URL del streaming
    const dbref = ref(getDatabase());
    get(child(dbref, this.stream)).then((snapshot) => {
      this.src = snapshot.val().url;
      this.iniciarStreaming(this.src);
    });

    let nextBlock = moment().add(1, 'h')
    nextBlock = moment(nextBlock.format('YYYY-MM-DD HH:00:00'))
    let alertEnd = nextBlock.subtract(3, 'minutes').diff(moment(), 'seconds')

    //Se establece un temporizador para controlar el tiempo de ejecución de la planta
    setTimeout(() => {
      this.openSnackBar('La practica pronto terminara, no es posible realizar mas ejecuciones')
      this.close = true
      setTimeout(() => {
        this.openSnackBar('La practica ha finalizado')
        this.finalizarPractica()
      }, 175000)
    }, alertEnd * 1000)
  }

  /**
   * Método donde inicia el streaming de la planta
   * @param url : URL correspondiente a la cámara de la planta
   */
  iniciarStreaming(url: string) {
    var x = document.createElement("IFRAME");
    x.style.width = "720px";
    x.style.height = "480px";
    x.setAttribute("src", url);
    let iframe = document.getElementById("iframe")!
    iframe.innerHTML = ''
    iframe.appendChild(x);
  }

  /**
   * Método donde se finaliza la práctica, es en este punto donde el streaming finaliza
   */
  finalizarPractica() {
    const dbref = ref(getDatabase());
    set(ref(getDatabase(), this.stream), {
      estado: 0,
      cerrar: 1,
      url: this.src
    }).then(() => {
      this.finished = true
      this.userSvc.getCurrentUserFullInfo().then(user => {
        if(user['rol'] == "Estudiante"){
         let idBooking = localStorage.getItem("idBooking")
         this.scheduleSvc.practiceFinished(idBooking)
         this.createPdf()
        }
      })
      //Se debe habilitar la linea de abajo para que cambie de ruta y salga de la vista de práctica en ejecución
      this.router.navigate(['/'], { relativeTo: this.activatedRoute });
    })
  }

  /**
   * Método que implementa la inicialización del formulario correspondiente a los campos de entrada de la planta seleccionada.
   */
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

  /**
   * Método que controla el valor del slider, esto se usa en campos de entrada que sean númericos,
   * como lo es por ejemplo el desplazamiento del resorte en Ley de Hooke. 
   */
  sliderChange(value: number, nameControl: string) {
    this.practiceForm.get(nameControl)?.setValue(value)
  }

  /**
   * Método que implementa la lógica para iniciar la repetición de la planta
   */
  startPlant() {
    let obj: Object = new Object();
    this.constants.forEach(cons => {
      let value = this.practiceForm.get(cons.getId())?.value
      Object.defineProperty(obj, cons.getId(), { value: value, enumerable: true })
    })
    obj['Inicio'] = 1
    this.processing = true
    this.plantRef.update(obj)
    /* this.plantRef.update(obj).then(() => {
      this.plantRef.update({ Inicio: 1 }).then(() => {
        this.processing = true
      }) */
  }

  /**
   * Método que implementa la lógica para detener la repetición de la planta
   * NOTA: Este método está creado de forma auxiliar para realizar la simulación del lanzamiento del resultado por parte de la planta,
   * en el método ngOnInit se captura el evento cuando la planta arroja "terminado = true", y es ahí donde se captura el resultado.
   * Por el momento el resultado está quemado y es "25".
   */
  stopPlant() {
    this.processing = false
    this.plantRef.update({
      Inicio: 0,
      Resultado: 25,
      Terminado: 1,
    })
  }

  /**
   * Método para validar y obtener mensajes de error de los campos de entrada.
   */
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

  /**
   * Método que captura el reporte de anomalía por parte del usuario
   */
  async onReportAnomaly() {
    const infoCurrentUser = await this.userSvc.getCurrentUserFullInfo()
    let currentDate = new Date()
    let dialogRef = this.dialogReportAnomaly.open(ReportAnomalyComponent,
      {
        data: { student: infoCurrentUser, studentGroup: this.studentGroup, practiceSelected: this.practiceSelected, dateReport: currentDate, subjectSelected: this.subjectSelected},
        height: 'auto', width: '600px'
      })
    const dialogSuscription = dialogRef.afterClosed().subscribe(()=>{
      this.openSnackBar("Reporte enviado exitosamente")
    })
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }

  /**
   * Lógica utilizada para la creación del PDF de resultados
   */
  createPdf() {
    let entries = Object.keys(this.pdfData[0])
    const pdfDefinition: any = {
      content: [
        {
          text: 'Laboratorios remotos - Universidad del Cauca\n\n',
          style: 'header'
        },
        {
          text: 'Información de la práctica\n\n',
          style: 'subheader'
        },
        'Materia: ' + this.subjectSelected.getObjectDB().getNombre() + '\n',
        'Práctica: ' + this.practiceSelected.getObjectDB().getNombre() + '\n',
        'Planta: ' + this.plantName + '\n',
        'Docente: ' + this.subjectSelected.getObjectDB().getDocente() + '\n\n',
        {
          text: 'Grupo de trabajo\n\n',
          style: 'subheader'
        },
        {
          text: this.studentGroup.getObjectDB().getGrupo().map(student => { return student.getName() + '\n' }),
        },
        {
          text: '\nResultados de la práctica\n\n',
          style: 'subheader'
        },
        table(this.pdfData, entries)
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        table: {
          alignment: 'center'
        }
      }
    }
    const pdf = pdfMake.createPdf(pdfDefinition)
    pdf.download()
    //this.router.navigate(['/'], { relativeTo: this.activatedRoute });
  }
  
  
}
function table(data, columns) {
  return {
    table: {
      widths: setWidth(columns),
      headerRows: 1,
      body: buildTableBody(data, columns),
    }
  }
}
function setWidth(columns) {
  let arrayWidth = new Array(columns.length)
  return arrayWidth.fill(100)
}
function buildTableBody(data, columns) {
  var body = [];
  body.push(columns);
  data.forEach(function (row) {
    var dataRow = [];
    columns.forEach(function (column) {
      dataRow.push(row[column].toString());
    })
    body.push(dataRow);
  });
  return body;
}
