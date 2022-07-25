import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FileLink, getFileLinkPath, ResultFileLinks } from 'src/app/models/FileLink';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Results } from 'src/app/models/Results';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-student-practices',
  templateUrl: './student-practices.component.html',
  styleUrls: ['./student-practices.component.css']
})
export class StudentPracticesComponent implements OnInit {

  groups: ObjectDB<GroupWithNames>[] = [];
  results: ObjectDB<Results>[] = [];
  resultsFileLinks: ResultFileLinks[] = []
  withResults: number[] = []
  withoutResults: number[] = []

  //load attributes
  validatorLinks: Subject<void> = new Subject;
  load!: boolean

  constructor(private route: ActivatedRoute, private storageSvc: StorageService) { }

  ngOnInit(): void {
    this.load = true;
    this.groups = this.route.snapshot.data['groups'];
    this.results = this.route.snapshot.data['results'];
    this.results.forEach(r => {
      let index = this.groups.findIndex(g => g.getId() === r.getId())
      this.withResults.push(index)
      this.resultsFileLinks.push({
        events: getFileLinkPath(r.getObjectDB().getEventos()),
        eventsLink: false,
        results: getFileLinkPath(r.getObjectDB().getResultados()),
        resultsLink: false
      })
    })
    if (this.results.length > 0) {
      this.validatorLinks.subscribe(() => {
        if (!(this.resultsFileLinks.some(rfl => !rfl.eventsLink) || this.resultsFileLinks.some(rfl => !rfl.resultsLink))) {
          this.load = false
        }
      })
    }else{
      this.load = false
    }
    let index = 0;
    this.groups.forEach(g => {
      let res = this.withResults.some(n => n === index)
      if (!res) {
        this.withoutResults.push(index)
      }
      index += 1;
    })
    this.resultsFileLinks.forEach(rfl => {
      this.storageSvc.getUrlFile(rfl.results.getLink()!).subscribe(url => {
        rfl.results.setLink(url)
        rfl.resultsLink = true
        this.validatorLinks.next()
      })
      this.storageSvc.getUrlFile(rfl.events.getLink()!).subscribe(url => {
        rfl.events.setLink(url)
        rfl.eventsLink = true
        this.validatorLinks.next()
      })
    })
  }

  openFile(fileLink: FileLink) {
    if (fileLink.getLink()) {
      const downloadLink = document.createElement('a')
      downloadLink.href = fileLink.getLink()!
      downloadLink.setAttribute('preview', fileLink.getName())
      downloadLink.setAttribute('target', 'blank')
      document.body.appendChild(downloadLink)
      downloadLink.click()
    }
  }
}
