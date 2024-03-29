import { SubjectService } from 'src/app/services/subject.service';
import { PracticeService } from 'src/app/services/practice.service';
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { ObjectDB } from "src/app/models/ObjectDB";
import { Practice } from "src/app/models/Practice";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PracticesStudentResolverService implements Resolve<ObjectDB<Practice>[]>{
    constructor(private practiceSvc: PracticeService, private subjectSvc: SubjectService) { }
    resolve(): ObjectDB<Practice>[] | Observable<ObjectDB<Practice>[]> | Promise<ObjectDB<Practice>[]> {
        let idSubjectSelected = localStorage.getItem("subjectSelected")!
        return this.subjectSvc.getSubjectRefById(idSubjectSelected).then(async res => {
            let practices = await this.practiceSvc.getPracticesBySubject(res.ref)
            return practices
        })
    }
}