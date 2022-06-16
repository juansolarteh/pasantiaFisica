import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { PracticeService } from 'src/app/services/practice.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ObjectDB } from "src/app/models/ObjectDB";
import { Practice } from "src/app/models/Practice";
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PracticesStudentResolverService implements Resolve<ObjectDB<Practice>[]>{
    constructor(private practiceSvc: PracticeService, private subjectSvc: SubjectService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ObjectDB<Practice>[] | Observable<ObjectDB<Practice>[]> | Promise<ObjectDB<Practice>[]> {
        let subjectSelected = this.subjectSvc.getSubjectSelected()
        return this.subjectSvc.getSubjectRefById(subjectSelected.getId()).then(async res => {
            let practices = await this.practiceSvc.getPracticesBySubject(res.ref)
            return practices
        })
    }
}