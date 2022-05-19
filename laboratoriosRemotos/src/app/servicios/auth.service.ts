import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

export interface respService {
  approved: boolean
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afauth: AngularFireAuth) { }

  async loginGoogle() {
    var result: respService = {
      approved: false,
      message: "Error al autenticar, intente de nuevo"
    }
    try {
      const promesaLogin = this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const usuario = (await promesaLogin).user
      const dominio = usuario?.email?.split('@')[1].toString()
      if (dominio == "unicauca.edu.co" && usuario?.email != null && usuario?.displayName != null && usuario?.uid != null) {
        result = {
          approved: true,
          message: 'Login exitoso'
        }
        localStorage.setItem('email', usuario?.email)
        this.setLocal(usuario.email, usuario.displayName, usuario.uid);
      } else {
        (await promesaLogin).user?.delete()
        result = {
          approved: false,
          message: 'Dominio no pertenece a @unicauca.edu.co'
        }
      }
    } finally {
      return result
    }
  }

  async logout() {
    var result: respService = {
      approved: false,
      message: 'Error de conexiòn, intente de nuevo'
    }
    try {
      const a = this.afauth.signOut()
      this.removeLocal()
      result = {
        approved: true,
        message: 'Logout exitoso'
      }
    } finally {
      return result
    }
  }

  private setLocal(email: string, name: string, key: string) {
    localStorage.setItem('email', email)
    localStorage.setItem('name', name)
    localStorage.setItem('key', key)
  }

  private removeLocal(){
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('key')
  }
}
