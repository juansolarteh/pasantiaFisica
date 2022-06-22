import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { MemberGroup } from '../models/MemberGroup';
import { convertTo } from '../models/ObjectConverter';
import { ObjectDB } from '../models/ObjectDB';
import { ResponseService } from '../models/ResponseService';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private col = this.firestr.firestore.collection('Usuarios');
  private userLoggedRef!: DocumentReference;

  constructor(private firestr: AngularFirestore) { }

  getUserLoggedRef(){
    return this.userLoggedRef;
  }

  async defineRol(email: string) {
    const querySnapShot = this.col.where('correo', '==', email).get();
    if ((await querySnapShot).size > 0) {
      (await querySnapShot).forEach((doc) => {
        this.userLoggedRef = doc.ref;
        localStorage.setItem('rol', doc.data()['rol']);
        if (doc.data()['nombre'] == undefined || doc.data()['nombre'] == '') {
          this.firestr.doc(doc.ref).update({ nombre: localStorage.getItem('name') });
        }
        localStorage.setItem('idUsuario', doc.id);
      });
    } else {
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      localStorage.setItem('rol', 'Estudiante');
      if (name && email) {
        const student: User = new User(name, email, 'Estudiante');
        let userRef = await this.onAddUser(student);
        if (userRef){
          this.userLoggedRef = userRef;
        }
      }
    }
  }

  getRefUser(idUser: string){
    return this.col.doc(idUser)
  }

  async getUser(idUser: string) {
    const documentSnapShot = this.col.doc(idUser).get();
    return (await documentSnapShot).data();
  }

  private sort(list: MemberGroup[]) {
    list.sort(function (a, b) {
      if (a.getName() > b.getName()) {
        return 1;
      }
      if (a.getName() < b.getName()) {
        return -1;
      }
      return 0;
    })
    return list
  }

  async getGroupMembers(refUser: DocumentReference[]) {
    let membersProm = refUser.map(async ref => {
      return await this.getGroupMember(ref)
    })
    let members = await Promise.all(membersProm)
    return this.sort(members)
  }

  async getGroupMember(refUser: DocumentReference) {
    let doc = await refUser.get();
    let name: string = doc.get('nombre');
    return new MemberGroup(refUser.id, name);
  }

  async getUsers() {
    var listUsers: ObjectDB<User>[] = [];
    const querySnapShot = this.col.where('rol', 'in', ['Docente', 'Laboratorista']).get();
    (await querySnapShot).forEach((res) => {
      let user: User = convertTo(User, res.data());
      listUsers.push(new ObjectDB(user, res.id));
    });
    return listUsers;
  }

  deleteUser(refUser: DocumentReference) {
    this.firestr.doc(refUser).delete();
  }

  async addUser(user: User) {
    var result: ResponseService<string> = new ResponseService(false, 'Fallo de conexion, intente de nuevo');
    const dominio = user.getCorreo().split('@')[1].toString();
    try {
      if (dominio === "unicauca.edu.co") {
        const querySnapShot = this.col.where('correo', '==', user.getCorreo()).get();
        if ((await querySnapShot).size == 0) {
          let idUser = (await this.col.add(user)).id;
          result = new ResponseService(true, 'Usuario registardo exitosamente', idUser);
        } else {
          result = new ResponseService(false, 'El usuario con correo ' + user.getCorreo() + ' ya se encuentra registrado');
        }
      } else {
        result = new ResponseService(false, 'El dominio no pertenece a @unicauca.edu.co');
      }
    } finally {
      return result
    }
  }

  private onAddUser(user: User){
    try {
      return this.col.add(user);
    } catch (error) {
      return null
    }
  }
}