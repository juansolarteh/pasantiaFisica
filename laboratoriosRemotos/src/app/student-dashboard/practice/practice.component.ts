import { StorageService } from 'src/app/services/storage.service';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Subject } from 'src/app/models/Subject'
import { Subject as Sub } from 'rxjs'
import { SubjectService } from 'src/app/services/subject.service';
import { Practice } from 'src/app/models/Practice';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { PracticeService } from 'src/app/services/practice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, get, ref, set, child } from 'firebase/database';
import { GroupWithNames } from 'src/app/models/Group';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private datePipe: DatePipe, private storageSvc: StorageService) { }
  practiceSelected!: ObjectDB<Practice>
  subjectSelected!: ObjectDB<Subject>
  studentGroup!: ObjectDB<GroupWithNames>
  booking: DocumentData
  files: any[]

  ngOnInit(): void {
    this.practiceSelected = this.activatedRoute.snapshot.data['practiceSelected']
    this.subjectSelected = this.activatedRoute.snapshot.data['subjectSelected']
    this.studentGroup = this.activatedRoute.snapshot.data['studentGroup']
    this.booking = this.activatedRoute.snapshot.data['plantValidation']
    console.log(this.booking);
    
    if (this.practiceSelected.getObjectDB().getDocumentos()) {
      this.files = this.getFiles()
    }
  }

  handleStartPractice() {
    if (!this.studentGroup) {
      this.openSwalAlert("Error al iniciar práctica", "Debes pertenecer a un <b>grupo de trabajo</b> para poder realizar la práctica.", 'info')
      return
    }
    if (!this.booking) {
      this.openSwalAlert("Error al iniciar práctica", 'Debes realizar un <b>agendamiento</b> para poder realizar la práctica.', 'info')
      return
    }
    let date = this.booking['fecha'].seconds * 1000
    if (!this.isValidBookingDate(date)) {
      let practiceExecutionDate = this.datePipe.transform(date, "medium")!
      this.openSwalAlert("Error al iniciar práctica", 'La fecha de reserva para realizar la práctica es la siguiente: <b>' + practiceExecutionDate + '</b><br>Intenta realizar la práctica en el horario correspondiente.<br>Recuerda que tienes un margen de 30 minutos para ingresar a partir de la hora agendada.', 'info')
      return
    }
    console.log("Entrando a la practica");
    this.startPractice()
  }

  private startPractice() {
    const dbref = ref(getDatabase());
    get(child(dbref, "StreamPlanta1"))
      .then((snapshot) => {
        console.log(snapshot.val().estado);
        if (snapshot.val().estado == 0) {
          set(ref(getDatabase(), 'StreamPlanta1'), {
            estado: 1,
            url: snapshot.val().url,
            cerrar: 0
          });
        }
      });
    setTimeout(this.navigateToPracticeExecution.bind(this), 2000)
  }
  goToBookings() {

    if (!this.isValidGoToBookings()) {
      let currentDate = this.datePipe.transform(new Date(), "shortDate")!
      let startDateToBooking = this.datePipe.transform(this.practiceSelected.getObjectDB().getInicio().seconds * 1000, "shortDate")!
      let limitDateToBooking = this.datePipe.transform(this.practiceSelected.getObjectDB().getFin().seconds * 1000, "shortDate")!
      this.openSwalAlert("Error al Ir A Agenda", `Solo se puede agendar desde el
      <b>${startDateToBooking}</b> hasta el <b>${limitDateToBooking}.</b><br><br>
      La fecha actual es <b>${currentDate}.</b>`, "warning")
      return
    }
    this.router.navigate(['./calendar', this.practiceSelected.getId()], { relativeTo: this.activatedRoute.parent })
  }

  private isValidGoToBookings() {
    let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")!
    let startDateToBooking = this.datePipe.transform(this.practiceSelected.getObjectDB().getInicio().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")!
    let limitDateToBooking = this.datePipe.transform(this.practiceSelected.getObjectDB().getFin().seconds * 1000, "yyyy-MM-ddTHH:mm:ss")!
    return moment(currentDate).isAfter(startDateToBooking) && moment(currentDate).isBefore(limitDateToBooking) ? true : false
  }

  private navigateToPracticeExecution() {
    localStorage.setItem("idBooking",this.booking['id'])
    this.router.navigate(['./practice-execution', this.practiceSelected.getId()], { relativeTo: this.activatedRoute.parent })
  }

  private isValidBookingDate(bookingDate: number) {
    let practiceExecutionDate = this.datePipe.transform(bookingDate, "yyyy-MM-ddTHH:mm:ss")!
    let currentDate = this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")!
    let limitExecution = moment(practiceExecutionDate).add(30, 'minutes')
    return moment(currentDate).isAfter(practiceExecutionDate) && moment(currentDate).isBefore(limitExecution) ? true : false
  }

  private openSwalAlert(title: string, message: string, icon: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showConfirmButton: false,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cerrar'
    })
  }

  getFileIcon(extension: string) {
    const extensionsToIcons = {
      pdf: "/assets/imagenes/pdf.png",
      doc: "/assets/imagenes/word.png",
      xls: "/assets/imagenes/excel.png",
      png: "/assets/imagenes/image.png",
    };
    return extensionsToIcons[extension]
  }

  private getFiles() {
    let filesUrls = []
    filesUrls = this.practiceSelected.getObjectDB().getDocumentos().map(document => {
      const fileName = this.getFileName(document)
      const fileExtension = this.getFileExtension(fileName)
      return { nameFile: fileName, fileExtension: fileExtension, urlDownload: this.storageSvc.getUrlFile(document) }
    })
    return filesUrls
  }

  private getFileName(path: string) {
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  private getFileExtension(fileName: string) {
    const parts = fileName.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

}