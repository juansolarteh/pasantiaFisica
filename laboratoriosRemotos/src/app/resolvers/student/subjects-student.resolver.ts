import { GroupsService } from 'src/app/services/groups.service';
import { Subject } from './../../models/Subject';
import { ObjectDB } from './../../models/ObjectDB';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { SubjectTeacher } from 'src/app/models/SubjectTeacher';



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
            let subjectsWithAllInfo = this.getAllInfo(listSubjects)
            return subjectsWithAllInfo
        })
    }

    private getAllInfo(listSubjects : ObjectDB<SubjectTeacher>[]){
        let subjectsWithAllInfo : ObjectDB<Subject>[] = []
        listSubjects.forEach(async subject=>{
            let name = await this.userSvc.getUserName( subject.getObjectDB().getDocente())
            let newSubject = new Subject(subject.getObjectDB().getClave(),
            subject.getObjectDB().getDescripcion(),
            name,subject.getObjectDB().getNombre(),
            subject.getObjectDB().getNumGrupos())
            subjectsWithAllInfo.push(new ObjectDB<Subject>(newSubject,subject.getId()))
        })
        return subjectsWithAllInfo
    }
}