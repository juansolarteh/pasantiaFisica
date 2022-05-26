import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ResultadoServicio } from '../modelos/resultadoServicio';

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
    var result: ResultadoServicio = {
      approved: false,
      message: "Error al autenticar, intente de nuevo"
    }
    try {
      const promesaLogin = this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const usuario = (await promesaLogin).user
      const dominio = usuario?.email?.split('@')[1].toString()
      if (dominio == "unicauca.edu.co" && usuario?.email != null && usuario?.displayName != null && usuario?.getIdToken() != null) {
        result = {
          approved: true,
          message: 'Login exitoso'
        }
        this.setLocal(usuario.email, usuario.displayName, await usuario.getIdToken());
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
    var result: ResultadoServicio = {
      approved: false,
      message: 'Error al realizar la opercaión, intente de nuevo'
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

  async isLogged() {
    const obs = this.afauth.authState
    const user = await firstValueFrom(obs)
    if (user) {
      if (user?.email && user?.displayName && user.email == localStorage.getItem('email')
        && user.displayName == localStorage.getItem('name')) {
        const token = user.getIdToken()
        if ((await token) == localStorage.getItem('token')) {
          return true
        }
      }
    }
    this.removeLocal()
    return false
  }

  private setLocal(email: string, name: string, token: any) {
    localStorage.setItem('email', email)
    localStorage.setItem('name', name)
    localStorage.setItem('token', token)
  }

  private removeLocal() {
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
  }
}
