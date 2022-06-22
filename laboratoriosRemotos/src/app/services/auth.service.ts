import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ResponseService } from '../models/ResponseService';

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
    var result: ResponseService<void> = new ResponseService(false, 'Error al autenticar, intente de nuevo');
    try {
      const promesaLogin = this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      const usuario = (await promesaLogin).user;
      const dominio = usuario?.email?.split('@')[1].toString();
      if (dominio == "unicauca.edu.co" && usuario?.email != null && usuario?.displayName != null && usuario?.getIdToken() != null) {
        result = new ResponseService(true, 'Login exitoso');
        this.setLocal(usuario.email, usuario.displayName, await usuario.getIdToken());
      } else {
        (await promesaLogin).user?.delete();
        result = new ResponseService(false, 'Dominio no pertenece a @unicauca.edu.co');
      }
    } finally {
      return result;
    }
  }

  async logout() {
    var result: ResponseService<void> = new ResponseService(false, 'Error al realizar la opercaión, intente de nuevo');
    try {
      const a = this.afauth.signOut();
      this.removeLocal();
      result = new ResponseService(true, 'Logout exitoso');
    } finally {
      return result;
    }
  }

  async isLogged() {
    const obs = this.afauth.authState;
    const user = await firstValueFrom(obs);
    if (user) {
      if (user?.email && user?.displayName && user.email == localStorage.getItem('email')
        && user.displayName == localStorage.getItem('name')) {
        const token = user.getIdToken();
        if ((await token) == localStorage.getItem('token')) {
          return true;
        }
      }
    }
    this.removeLocal();
    return false;
  }

  private setLocal(email: string, name: string, token: any) {
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
  }

  private removeLocal() {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
  }
}
