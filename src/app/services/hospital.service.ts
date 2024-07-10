import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  cargarHospitales(){
    return this.http.get<any>(`${base_url}/hospitales`, this.headers);
  }

  crearHospital(nombre: string){
    return this.http.post<any>(`${base_url}/hospitales/`, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    return this.http.put<any>(`${base_url}/hospitales/${_id}`, { nombre }, this.headers);
  }

  eliminarHospital(_id: string) {
    return this.http.delete<any>(`${base_url}/hospitales/${_id}`, this.headers);
  }
}
