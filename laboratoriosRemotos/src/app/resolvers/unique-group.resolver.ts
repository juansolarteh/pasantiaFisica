import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GroupsService } from '../services/groups.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UniqueGroupResolver implements Resolve<string[]> {

  constructor(
    private groupSvc: GroupsService,
    private userSvc: UserService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<string[]> {
    const groupId: string = route.paramMap.get('groupid')!;
    return this.groupSvc.getGroupById(groupId).then(group => {
      let promises = group.map(member => {
        return this.userSvc.getUserName(member)
      })
      return Promise.all(promises)
    })
  }
}
