import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Usuario } from "../modelos/usuario";
import { UserService } from "../servicios/usuario.service";

@Injectable({ providedIn: 'root' })
export class WorkersResolverService implements Resolve<Usuario[]>{
    constructor(private userSvc: UserService) { }
    resolve(): Usuario[] | Observable<Usuario[]> | Promise<Usuario[]> {
        return this.userSvc.getWorkers()
    }
}