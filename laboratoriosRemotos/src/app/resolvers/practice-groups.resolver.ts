import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { GroupWithNames } from '../models/Group';
import { ObjectDB } from '../models/ObjectDB';
import { GroupsService } from '../services/groups.service';
import { PracticeService } from '../services/practice.service';
import { SubjectService } from '../services/subject.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PracticeGroupsResolver implements Resolve<ObjectDB<GroupWithNames>[]> {

  constructor(
    private practiceSvc: PracticeService,
    private subjectSvc: SubjectService,
    private groupSvc: GroupsService,
    private userSvc: UserService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ObjectDB<GroupWithNames>[]> {
    const idPrac: string = route.parent?.paramMap.get('practiceid')!;
    return this.practiceSvc.getRefSubjectById(idPrac).then(subjectRef => {
      return this.subjectSvc.getRefGroupsFromSubjectId(subjectRef.id).then(async refGroups => {
        let groupsDB = await this.groupSvc.getFromRefs(refGroups);
        let promMembers = groupsDB.map(async groupDB => {
          let members = await this.userSvc.getGroupMembers(groupDB.getObjectDB().getGrupo())
          let groupWithNames = new GroupWithNames(members, groupDB.getObjectDB().getLider().id)
          return new ObjectDB<GroupWithNames>(groupWithNames, groupDB.getId())
        });
        return await Promise.all(promMembers)
      });
    })
  }
}
