import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
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

  private transformarUsuarios(resultados: any[]){
    return {
      ok: true,
      usuarios: resultados.map(
        user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    )
    }
  }

  private transformarHospitales(resultados: any[]) {
    return {
      ok: true,
      hospitales: resultados.map(
        hospital => new Hospital(hospital.nombre, hospital.id, hospital.img, hospital.usuario)
      )
    }
  }

  private transformarMedicos(resultados: any[]) {
    return {
      ok: true,
      medicos: resultados.map(
        medico => new Medico(medico.nombre, medico.id, medico.img, medico.usuario, medico.hospital)
      )
    }
  }

  buscar(tipo: 'usuarios'|'medicos'|'hospitales', termino: string = ''){
    return this.http.get<any>(`${base_url}/todo/coleccion/${tipo}/${termino}`, this.headers)
    .pipe(
      map(
        (resp: any) => {

          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);

            case 'hospitales':
              return this.transformarHospitales(resp.resultados);

            case 'medicos':
              return this.transformarMedicos(resp.resultados);
          }
        }
      )
    )

  }
}
