import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../modelos/user";
import { UserService } from "../servicios/user.service";

@Injectable({ providedIn: 'root' })
export class WorkersResolverService implements Resolve<User[]>{
    constructor(private userSvc: UserService) { }
    resolve(): User[] | Observable<User[]> | Promise<User[]> {
        return this.userSvc.getWorkers()
    }
}