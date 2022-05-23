import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../modelos/user";
import { UserService } from "../servicios/user.service";

@Injectable({ providedIn: 'root' })
export class WorkersResolverService implements Resolve<User[]>{
    constructor(private userSvc: UserService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | Observable<User[]> | Promise<User[]> {
        return this.userSvc.getWorkers()
    }
}