import { Subject } from '../models/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/compat/firestore';
import { ObjectDB } from '../models/ObjectDB';
import { convertTo } from '../models/ObjectConverter';
import { SubjectUltimo } from '../models/SubjectUltimo';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private col = this.firestr.firestore.collection('Materias');
  
  subjects: Subject[] = [];
  

  constructor(private firestr: AngularFirestore) { }

  deleteFromReference(refSubject: DocumentReference) {
    this.firestr.doc(refSubject).delete();
  }

  async getStudentsWithouGroup(subjectId: string){
    const doc = await this.col.doc(subjectId).get();
    let withoutGroups: DocumentReference[] = doc.get('sinGrupo');
    return withoutGroups;
  }

  async getRefGroupsFromSubjectId(subjectId: string){
    const doc = await this.col.doc(subjectId).get();
    let refGroups: DocumentReference[] = doc.get('grupos');
    return refGroups;
  }

  async getSubjectById(idSubject: string) {
    let data = (await this.col.doc(idSubject).get()).data();
    return convertTo(SubjectUltimo, data!);
  }

  async getNameSubjects(teacherRef: DocumentReference){
    var listSubjects: ObjectDB<string>[] = [];
    const querySnapShot = this.col.where('docente', '==', teacherRef).get();
    (await querySnapShot).forEach((res) => {
      listSubjects.push(new ObjectDB(res.get('nombre'), res.id));
    });
    return listSubjects;
  }

  async prueba(studentRef: DocumentReference){
    var listSubjects: DocumentReference[] = [];
    (await this.firestr.firestore.collection('Grupos').where('grupo', 'array-contains', studentRef).get()).forEach(r =>{
      let refSubject: DocumentReference = r.get('Materia');
    })
  }

  async getSubjectsFromStudent(refStudent: DocumentData) {
    //Obtencion de referencias de materias
    const mapMaterias = refStudent["materias"]
    const refMaterias: any[] = [];
    //Almacenamos las referencias en un ArrayDeReferencias
    for (const key in mapMaterias) {
      refMaterias.push(mapMaterias[key])
    }
    //Recorremos Las referencias y creamos nuevas materias en una lista
    refMaterias.forEach(element => {
      this.col.doc(element.id).get().then(res => {
        let data = res.data()
        if (data != undefined) {
          let subject_info = {
            clave: data['clave'],
            descripcion: data['descripcion'],
            nombre: data['nombre'],
            numGrupos: data['numGrupos'],
            docente: data['docente']
          }
          let subject = new Subject(element.id, subject_info)
          this.subjects.push(subject)
        }
      })
    })
    return this.subjects
  }

  async getRefSubjectsFromRefUser(refUser: DocumentReference){
    var refSubjects: DocumentReference[] = [];
    const querySnapShot = this.col.where('docente', '==', refUser).get();
    (await querySnapShot).forEach((doc) => {
      refSubjects.push(doc.ref);
    })
    return refSubjects;
  }

}
