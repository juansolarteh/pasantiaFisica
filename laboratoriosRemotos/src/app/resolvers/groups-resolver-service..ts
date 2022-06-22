import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SubjectService } from '../services/subject.service';
import { GroupsService } from '../services/groups.service';
import { ObjectDB } from '../models/ObjectDB';
import { UserService } from '../services/user.service';
import { MemberGroup } from '../models/MemberGroup';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { GroupWithNames } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupsResolverServiceResolver implements Resolve<ObjectDB<GroupWithNames>[]> {

  constructor(private subjectSvc: SubjectService, private groupSvc: GroupsService, private userSvc: UserService) { }
  
  resolve(): ObjectDB<GroupWithNames>[] | Observable<ObjectDB<GroupWithNames>[]> | Promise<ObjectDB<GroupWithNames>[]> {
    const subjectId = localStorage.getItem('subjectId');
    return this.subjectSvc.getRefGroupsFromSubjectId(subjectId!).then(async refGroups => {
      let groupsDB = await this.groupSvc.getFromRefs(refGroups);
      let promMembers = groupsDB.map(async groupDB => {
        let members = await this.userSvc.getGroupMembers(groupDB.getObjectDB().getGrupo())
        let groupWithNames = new GroupWithNames(members, groupDB.getObjectDB().getLider().id)
        return new ObjectDB<GroupWithNames>(groupWithNames, groupDB.getId())
      });
      return await Promise.all(promMembers)
    });
  }
}
