import { UserService } from 'src/app/services/user.service';
import { MemberGroup } from 'src/app/models/MemberGroup';
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CurrentUserResolverService implements Resolve<MemberGroup>{
    constructor(private userSvc: UserService) { }
    resolve(): MemberGroup | Observable<MemberGroup> | Promise<MemberGroup> {
        return this.userSvc.getCurrentUser()
    }
}