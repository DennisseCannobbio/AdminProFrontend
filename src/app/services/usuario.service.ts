import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';



import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model'

const base_url = environment.base_url;

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone )
  {

  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  logout() {
    localStorage.removeItem('token');

    // TODO: CAMBIAR EL CORREO EN DURO, POR EL CORREO DEL USUARIO LOGUEADO
    google.accounts.id.revoke('dennissecannobbio@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
    })
    })
  }

  validarToken(): Observable<boolean> {

    google.accounts.id.initialize({
      client_id: '804191360855-jmtnl51pdmcg9c2co925gj898864of0m.apps.googleusercontent.com',
    });

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {

        let { email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token );
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${ base_url }/usuarios`, formData )
              .pipe(
                tap( (resp: any) => {
                  localStorage.setItem('token', resp.token )
                })
              )

  }

  actualizarUsuario(data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }


    return this.http.put(`${base_url}/usuarios/${this.uid}`, data,
      {
        headers: {
          'x-token': this.token
        }
      }
    )
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token )
                  })
                );
  }

  loginGoogle( token ) {
    return this.http.post(`${ base_url }/login/google`, { token } )
                .pipe(
                  tap( (resp: any) => {
                    console.log(resp)
                    localStorage.setItem('token', resp.token )
                  })
                );

  }
}
