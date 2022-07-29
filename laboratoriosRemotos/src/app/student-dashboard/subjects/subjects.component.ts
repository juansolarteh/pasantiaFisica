import { GroupsService } from 'src/app/services/groups.service';
import { DocumentReference } from '@firebase/firestore';
import { UserService } from 'src/app/services/user.service';
import { SubjectService } from 'src/app/services/subject.service';
import { Subject } from '../../models/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { DocumentData } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjects: ObjectDB<Subject>[] = [];
  
  constructor( private activatedRoute: ActivatedRoute, private readonly router: Router,
    private subjectSvc : SubjectService, private userSvc : UserService, private groupSvc : GroupsService) { }

  ngOnInit(): void{

    this.subjects = this.activatedRoute.snapshot.data['subjects'];
    
  }

  goToPractices(subject:ObjectDB<Subject>){
    localStorage.setItem("subjectSelected",subject.getId())
    this.router.navigate(['../subject',subject.getId()], {relativeTo: this.activatedRoute})
  }
  async goToDeleteSubject(subject:ObjectDB<Subject>){
    const studentRef = this.userSvc.getUserLoggedRef()
    //await this.subjectSvc.unregisterStudent(studentRef,subject.getId())
    let refGroups = await this.subjectSvc.getRefGroupsFromSubjectId(subject.getId())
    //let validate = await this.groupSvc.studentBelongAnyGroup(studentRef,refGroups)
    //console.log(validate);
    
  }
  setNewSubject(newSubject : ObjectDB<Subject>){
    this.subjects.push(newSubject)
  }
}