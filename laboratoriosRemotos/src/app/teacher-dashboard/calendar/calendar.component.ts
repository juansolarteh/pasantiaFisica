import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import { child, get, getDatabase, ref } from 'firebase/database';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('calendar', { static: true }) calendar!: FullCalendarComponent;
  calendarOptions!: CalendarOptions;
  practiceBookings: Object[] = []
  bookingsTimeStamp!: Timestamp[];
  state!: number

  //Button activation
  plantRef!: AngularFireObject<any>
  subjectIdPlant: Subject<string> = new Subject
  otherSubscriptions: Subscription[] = []
  subscriptionChangeValue!: Subscription
  nextBlock!: string

  inFit!: boolean;

  idPlant!: string;

  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnDestroy(): void {
    if (this.subscriptionChangeValue) {
      this.subscriptionChangeValue.unsubscribe();
    }
    this.otherSubscriptions.forEach(subs => {
      subs.unsubscribe()
    })
  }

  ngAfterViewInit(): void {
    let data = this.route.data.subscribe(data => {
      this.practiceBookings = []
      this.bookingsTimeStamp = data['calendar'];
      this.updateState()
      this.calendar.getApi().removeAllEvents()
      this.setBookingsOnCalendar()
      this.changeDetector.detectChanges();
    })
    this.otherSubscriptions.push(data)
  }

  ngOnInit(): void {
    this.inFit = false
    let nextBlock = moment().add(1, 'h')
    nextBlock = moment(nextBlock.format('YYYY-MM-DD HH:00:00'))
    let seconds = nextBlock.diff(moment(), 'seconds')
    let secondsPrevBlock = nextBlock.subtract(3, 'minutes').diff(moment(), 'seconds')

    setTimeout(() => {
      window.location.reload()
    }, seconds * 1000)

    setTimeout(() => {
      let nb = moment().add(1, 'h')
      this.nextBlock = moment(nb.format('YYYY-MM-DD HH:00:00')).format('HH:00:00')
      this.state = 3
      this.inFit = true;
      this.changeDetector.markForCheck();
    }, secondsPrevBlock * 1000)

    this.state = 1;
    this.calendarOptions = this.initCalendar();
    let subs = this.subjectIdPlant.subscribe(idPlant => {
      this.plantRef = this.db.object('Stream' + idPlant);
      if (this.subscriptionChangeValue) {
        this.subscriptionChangeValue.unsubscribe()
      }
      this.subscriptionChangeValue = this.plantRef.valueChanges().subscribe(event => {
        if (event.estado == 1) {
          this.state = 1;
        } else {
          if (!this.updateState() && !this.inFit) {
            this.state = 0;
          }
        }
        this.changeDetector.markForCheck()
      })
    })
    this.otherSubscriptions.push(subs)
    subs = this.route.params.subscribe(param => {
      this.idPlant = param['idPlant']
      this.subjectIdPlant.next(this.idPlant)
    })
    this.otherSubscriptions.push(subs)
  }

  initCalendar() {
    let calendar: CalendarOptions = {
      initialView: 'timeGridWeek',
      weekends: false,
      slotLabelInterval: 1,
      slotEventOverlap: false,
      allDaySlot: false,
      height: 500,
      expandRows: true,
      selectable: false,
      editable: false,
      slotDuration: '00:60:00',
      eventBackgroundColor: "#6d1a1d",
      eventBorderColor: "#6d1a1d",
      nowIndicator: true,
      buttonText: {
        today: "Hoy"
      },
      buttonHints: {
        prev: 'Anterior',
        next: 'Siguiente',
        today: 'Hoy'
      },
      views: {
        timeGridWeek: { buttonText: 'Semana' },
      },
      locale: "es",
      headerToolbar: {
        left: 'next,today',
        center: 'title',
        right: ''
      },
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
      },
      displayEventTime: false
    }
    return calendar
  }

  private setBookingsOnCalendar() {
    this.bookingsTimeStamp.forEach(booking => {
      let newEvent = {
        title: 'Planta Reservada',
        start: this.datePipe.transform(booking.seconds * 1000, "yyyy-MM-ddTHH:mm:ss"),
        end: this.datePipe.transform((booking.seconds + 3600) * 1000, "yyyy-MM-ddTHH:mm:ss")
      }
      this.practiceBookings.push(newEvent)
    })
    this.calendar.getApi().addEventSource(this.practiceBookings)
  }

  updateState() {
    let now = moment()
    let inPractice = this.bookingsTimeStamp.some(bts => moment(new Date(bts.seconds * 1000)).isSameOrBefore(now));
    if (inPractice) {
      this.state = 2;
      return true
    }
    return false
  }

  labelButton() {
    if (this.state === 0) {
      return 'Usar planta'
    } else if (this.state === 1) {
      return 'Planta en uso por docente'
    } else if (this.state === 2) {
      return 'Planta en practica'
    }
    return 'En ajuste de Planta, Si no esta agendado, puedes intentar a las ' + this.nextBlock
  }

  navigateExecution() {
    const dbref = ref(getDatabase());
    get(child(dbref, "Stream" + this.idPlant)).then((snapshot) => {
      let estado: number = snapshot.val().estado;
      if (estado === 1) {
        this.openSnackBar('No se puede ingresar, intentelo mas tarde')
      } else {
        this.plantRef.update({ estado: 1 }).then(() => {
          setTimeout(this.navigateTo.bind(this), 2000)
        })
      }
    });
  }

  private navigateTo() {
    localStorage.setItem('approved_navigation', 'true')
    this.router.navigate(['./plant', this.idPlant], { relativeTo: this.route.parent })
  }

  async openSnackBar(message: string) {
    this._snackBar.open(message)._dismissAfter(5000)
  }
}
