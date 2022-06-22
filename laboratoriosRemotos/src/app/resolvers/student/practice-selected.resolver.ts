import { PracticeService } from 'src/app/services/practice.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { Practice } from 'src/app/models/Practice';

@Injectable({
    providedIn: 'root'
})
export class PracticeSelectedResolverService implements Resolve<ObjectDB<Practice>> {

    constructor(private practiceSvc: PracticeService, private userSvc: UserService) { }
    resolve(): ObjectDB<Practice> | Observable<ObjectDB<Practice>> | Promise<ObjectDB<Practice>> {
        let idPracticeSelected = localStorage.getItem("practiceSelected")!
        return this.practiceSvc.getPracticeById(idPracticeSelected).then(res=>{
            return res
        })
    }
}