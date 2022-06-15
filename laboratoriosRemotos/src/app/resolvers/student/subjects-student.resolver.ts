import { DocumentReference } from '@angular/fire/compat/firestore';
import { GroupsService } from 'src/app/services/groups.service';
import { Subject } from './../../models/Subject';
import { ObjectDB } from './../../models/ObjectDB';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { SubjectUltimo } from 'src/app/models/SubjectUltimo';
import { convertTo } from 'src/app/models/ObjectConverter';


@Injectable({
    providedIn: 'root'
})
export class SubjectsStudentResolverService implements Resolve<ObjectDB<Subject>[]>{
    constructor(private subjectSvc: SubjectService, private userSvc: UserService, private groupSvc : GroupsService) { }

    resolve(): ObjectDB<Subject>[] | Observable<ObjectDB<Subject>[]> | Promise<ObjectDB<Subject>[]> {
        const studentRef = this.userSvc.getUserLoggedRef();

        return this.groupSvc.getGroupsByRefStudent(studentRef).then(async res => {
            let listWithGroup = await this.subjectSvc.getSubjectsByGroup(res)
            let listWithoutGroup = await this.subjectSvc.getSubjectsWithoutGroup(studentRef)
            let listSubjects = listWithGroup.concat(listWithoutGroup)
            console.log(listSubjects)
            return listSubjects
        })
    }

    /* private getAllInfo(listSubjects : ObjectDB<Subject>[]){
        listSubjects.map(subject=>{
            let teacher = subject.getObjectDB().getDocente()
        })
    } */
}