import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ObjectDB } from "../models/ObjectDB";
import { User } from "../models/User";
import { UserService } from "../services/user.service";

@Injectable({ providedIn: 'root' })
export class ManagerResolverService implements Resolve<ObjectDB<User>[]>{

    constructor(private userSvc: UserService) { }

    resolve(): ObjectDB<User>[] | Observable<ObjectDB<User>[]> | Promise<ObjectDB<User>[]> {
        return this.userSvc.getUsers();
    }
}