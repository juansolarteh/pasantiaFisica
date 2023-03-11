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
    constructor(private subjectSvc: SubjectService, private userSvc: UserService) { }

    async resolve(): Promise<ObjectDB<Subject>[]> {
        const studentRef = this.userSvc.getUserLoggedRef();
        console.log(studentRef);
        return this.subjectSvc.getSubjectsByStudentRef(studentRef).then(async res => {
            let subjectsStudent = res.map(async element => {
                let name = await this.userSvc.getUserName(element.getObjectDB().getDocente())
                let newSubject = new Subject(element.getObjectDB().getClave(),
                    element.getObjectDB().getDescripcion(),
                    name, element.getObjectDB().getNombre(),
                    element.getObjectDB().getNumGrupos())
                return new ObjectDB<Subject>(newSubject, element.getId())
            });
            return await Promise.all(subjectsStudent)
        });
    }
}