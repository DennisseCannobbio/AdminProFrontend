import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from 'rxjs/operators';
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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    if(this.usuario.email.includes("gmail.com")){
      google.accounts.id.revoke(this.usuario.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
      })
      })
    } else {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    }

  }


  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu));
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
        this.guardarLocalStorage(resp.token, resp.menu)
        return true;
      }),
      catchError( error => of(false) )
    );
  }


  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${ base_url }/usuarios`, formData )
              .pipe(
                tap( (resp: any) => {
                  this.guardarLocalStorage(resp.token, resp.menu);
                })
              )

  }

  actualizarUsuario(data: {email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data,this.headers)
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  loginGoogle( token ) {
    return this.http.post(`${ base_url }/login/google`, { token } )
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );

  }

  cargarUsuarios(desde: number = 0){
    return this.http.get<any>(`${base_url}/usuarios?desde=${desde}`, this.headers)
      .pipe(
        map(resp => {
          let usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          )
          return {
            ok: resp.ok,
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario){
    return this.http.delete<any>(`${base_url}/usuarios/${usuario.uid}`, this.headers);
  }

  cambiarRole(usuario: Usuario){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario,this.headers)
  }
}
