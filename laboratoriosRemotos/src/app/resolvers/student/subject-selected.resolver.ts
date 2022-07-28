import { convertTo } from 'src/app/models/ObjectConverter';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ObjectDB } from 'src/app/models/ObjectDB';
import { Subject } from 'src/app/models/Subject';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class SubjectSelectedResolverService implements Resolve<ObjectDB<Subject>> {

    constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }
    resolve(): ObjectDB<Subject> | Observable<ObjectDB<Subject>> | Promise<ObjectDB<Subject>> {
        let idSubjectSelected = localStorage.getItem("subjectSelected")!
        return this.subjectSvc.getSubjectById2(idSubjectSelected).then(async res => {
            let subjectSelected = this.getAllInfo(res)
            return subjectSelected
        })
    }

    private async getAllInfo(subject: ObjectDB<SubjectTeacher>) {
        let name = await this.userSvc.getUserName(subject.getObjectDB().getDocente())
        let newSubject = new Subject(subject.getObjectDB().getClave(),
            subject.getObjectDB().getDescripcion(),
            name, subject.getObjectDB().getNombre(),
            subject.getObjectDB().getNumGrupos())
        return new ObjectDB<Subject>(newSubject, subject.getId())
    }
}