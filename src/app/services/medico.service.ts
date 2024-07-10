import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Medico } from '../models/medico.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos(){
    return this.http.get<any>(`${base_url}/medicos`, this.headers);
  }

  cargarMedicoXId(id: string){
    return this.http.get<any>(`${base_url}/medicos/${id}`, this.headers)
  }

  crearMedico(nombre: string, hospital: string){
    return this.http.post<any>(`${base_url}/medicos`, { nombre, hospital }, this.headers);
  }

  actualizarMedico(id: string, nombre: string, hospital: string) {
    return this.http.put<any>(`${base_url}/medicos/${id}`,{ nombre, hospital }, this.headers);
  }

  eliminarMedico(_id: string) {
    return this.http.delete<any>(`${base_url}/medicos/${_id}`, this.headers);
  }
}
