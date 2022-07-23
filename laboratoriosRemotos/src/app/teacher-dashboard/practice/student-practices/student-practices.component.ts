import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private storageSvc: StorageService) { }

  ngOnInit(): void {
    this.groups = this.route.snapshot.data['groups'];
    this.results = this.route.snapshot.data['results'];
    this.results.forEach(r => {
      let index = this.groups.findIndex(g => g.getId() === r.getId())
      this.withResults.push(index)
      this.resultsFileLinks.push({
        events: getFileLinkPath(r.getObjectDB().getEventos()),
        results: getFileLinkPath(r.getObjectDB().getResultados())
      })
    })
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
      })
      this.storageSvc.getUrlFile(rfl.events.getLink()!).subscribe(url => {
        rfl.events.setLink(url)
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
