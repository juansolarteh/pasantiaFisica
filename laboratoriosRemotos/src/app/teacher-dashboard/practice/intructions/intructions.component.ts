import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { FileLink, getFileLinksPath } from 'src/app/models/FileLink';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Plant } from 'src/app/models/Plant';
import { Practice } from 'src/app/models/Practice';
import { PlantService } from 'src/app/services/plant.service';
import { StorageService } from 'src/app/services/storage.service';
import { imageFile } from 'src/environments/typeFiles';

interface node {
  name: string;
  children?: node[];
}

const TREE_DATA: node[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];



@Component({
  selector: 'app-intructions',
  templateUrl: './intructions.component.html',
  styleUrls: ['./intructions.component.css']
})
export class IntructionsComponent implements OnInit {

  practiceDB!: ObjectDB<Practice>
  fileLinks: FileLink[] = [];
  plant!: Plant
  constants!: ObjectDB<number[]>[]
  units: any;
  
  treeControl = new NestedTreeControl<node>(node => node.children);
  dataSource = new MatTreeNestedDataSource<node>();

  constructor(private route: ActivatedRoute, private storageSvc: StorageService, private plantSvc: PlantService) { }

  ngOnInit(): void {
    this.practiceDB = this.route.snapshot.data['practice']
    this.setFiles()
    this.getPlant()
    this.getConstants()
  }

  hasChild = (_: number, node: node) => !!node.children && node.children.length > 0;

  getConstants(){
    this.plantSvc.getConstantsDB(this.practiceDB.getObjectDB().getPlanta().id).then(cons => {
      this.constants = cons;
      this.units = this.plant.getUnidades()
      this.dataSource.data = this.initConstants()
    });
  }

  private initConstants(){
    let constantsData: node[] = []
    this.constants.forEach(cons => {
      let nod: node = {
        name: cons.getId(),
        children: []
      }
      cons.getObjectDB().forEach(val => {
        nod.children?.push({
          name: val.toString() + ' ' + this.units[cons.getId()],
        })
      })
      constantsData.push(nod)
    })
    return constantsData
  }

  getPlant() {
    this.plantSvc.getPlant(this.practiceDB.getObjectDB().getPlanta()).then(plant => {
      this.plant = plant
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

  setFiles() {
    if (this.practiceDB.getObjectDB().getDocumentos()) {
      this.fileLinks = this.fileLinks.concat(getFileLinksPath(this.practiceDB.getObjectDB().getDocumentos()))
      this.fileLinks.forEach(fl => {
        this.storageSvc.getTypeFile(fl.getLink()!).subscribe(type => {
          fl.setImage(imageFile(type))
        })
        this.storageSvc.getUrlFile(fl.getLink()!).subscribe(url => {
          fl.setLink(url)
        })
      })
    }
  }
}
