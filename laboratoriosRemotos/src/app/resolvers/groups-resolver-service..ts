import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { GroupsService } from '../services/groups.service';
import { ObjectDB } from '../models/ObjectDB';
import { Group, GroupWithNames } from '../models/Group';
import { UserService } from '../services/user.service';
import { MemberGroup } from '../models/MemberGroup';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<ObjectDB<GroupWithNames>[]> {
  constructor(private subjectSvc: SubjectService, private groupSvc: GroupsService, private userSvc: UserService) { }
  resolve(): ObjectDB<GroupWithNames>[] | Observable<ObjectDB<GroupWithNames>[]> | Promise<ObjectDB<GroupWithNames>[]> {
    const subject = this.subjectSvc.getRefSubjectSelected();
    const promise = this.groupSvc.getFromSubjectRef(subject);
    var groupsWithNames: ObjectDB<GroupWithNames>[] = []
    console.log(subject)
    promise.then(groupsDB => {
      groupsDB.forEach(groupDB => {
        let students: MemberGroup[] = this.userSvc.getNamesUsers(groupDB.getObjectDB().getGrupo());
        let leader!: DocumentReference;
        let isGroup: boolean = groupDB.getObjectDB().isEsGrupo();
        if (isGroup){
          leader = groupDB.getObjectDB().getLider();
        }
        let groupWithNames = new ObjectDB<GroupWithNames>(new GroupWithNames(isGroup, students, leader), groupDB.getId());
        groupsWithNames.push(groupWithNames);
      })
    })
    console.log('groupsWnames => ', groupsWithNames)
    return groupsWithNames;
  }
}
