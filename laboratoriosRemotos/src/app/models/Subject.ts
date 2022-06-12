
import { SubjectInfo } from "./SubjectInfo";

export class Subject{

    subject_id:string;
    //subject_ref: DocumentReference;
    subject_info:SubjectInfo;

    constructor(prmSubject_id:string, prmSubject_info:SubjectInfo) {
       //this.subject_ref = prmSubject_ref; 
       this.subject_id=prmSubject_id;
       this.subject_info=prmSubject_info;
    }

    getSubjectId(){
        return this.subject_id
    }
    
    getSubjectInfo(){
        return this.subject_info
    }

    setSubjectId(prmSubject_Id:string){
        this.subject_id = prmSubject_Id
    }
    setSubjectInfo(prmSubject_info:SubjectInfo){
        this.subject_info = prmSubject_info
    }
}