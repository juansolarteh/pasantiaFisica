import { GroupsService } from './../../services/groups.service';
import { SubjectService } from './../../services/subject.service';
import { GroupWithNames } from './../../models/Group';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Group } from "src/app/models/Group";
import { ObjectDB } from "src/app/models/ObjectDB";
import { UserService } from 'src/app/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class GroupStudentResolverService implements Resolve<ObjectDB<GroupWithNames>>{
    constructor(private subjectSvc: SubjectService, private userSvc: UserService, private groupSvc: GroupsService) { }
    resolve(): ObjectDB<GroupWithNames> | Observable<ObjectDB<GroupWithNames>> | Promise<ObjectDB<GroupWithNames>> {
        const refUser = this.userSvc.getUserLoggedRef()
        const idSubjectSelected = localStorage.getItem("subjectSelected")!
        let groupFullInfo! : ObjectDB<GroupWithNames>
        return this.subjectSvc.studentBelongToWithoutGroup(refUser,idSubjectSelected).then(async res=>{
            if(res === false){
                let refGroups = await this.subjectSvc.getRefGroupsFromSubjectId(idSubjectSelected)
                let groups = await this.groupSvc.getFromRefs(refGroups)
                let group = await this.getGroup(groups,refUser)
                let members = await this.userSvc.getGroupMembers(group.getObjectDB().getGrupo())
                let groupWithNames = new GroupWithNames(members,group.getObjectDB().getLider().id)
                return new ObjectDB<GroupWithNames>(groupWithNames,group.getId())
            }
            return groupFullInfo
        })
    }

    private async getGroup(groups:ObjectDB<Group>[], refUser : DocumentReference){
        let groupReturn! : ObjectDB<Group>
        groups.forEach(group =>{
            group.getObjectDB().getGrupo().forEach(user =>{
                if(user.isEqual(refUser)){
                    groupReturn = group
                }
            })
        })
        return groupReturn
    }
}