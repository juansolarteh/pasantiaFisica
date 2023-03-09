
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { GroupWithNames } from 'src/app/models/Group';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';


@Injectable({
  providedIn: 'root'
})
export class SubjectWithOutGroupResolverService implements Resolve<ObjectDB<GroupWithNames>> {
  constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
  
  resolve(): ObjectDB<GroupWithNames> | Observable<ObjectDB<GroupWithNames>> | Promise<ObjectDB<GroupWithNames>> {
    const idSubjectSelected = localStorage.getItem('subjectSelected');
    
    return this.subjectSvc.getStudentsWithouGroup(idSubjectSelected!).then(async refUsers => {
      let currentUser = await this.userSvc.getCurrentUser();
      let users = await this.userSvc.getGroupMembers(refUsers);
      let groupWithNames = new GroupWithNames(users);
      //let aux = groupWithNames.getGrupo().filter(member => member.getId() !== currentUser.getId())
      //groupWithNames.setGrupo(aux)
      return new ObjectDB<GroupWithNames>(groupWithNames, 'SG');
    });
  }
}
