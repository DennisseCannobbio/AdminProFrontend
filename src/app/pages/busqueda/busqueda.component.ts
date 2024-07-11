import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  lstUsuarios: Usuario[] = [];
  lstMedicos: Medico[] = [];
  lstHospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ termino }) => this.busquedaGlobal(termino))
  }

  busquedaGlobal(termino: string){
    this.busquedasService.busquedaGlobal(termino)
      .subscribe((resp: any) => {
        this.lstUsuarios = resp.usuarios;
        this.lstMedicos = resp.medicos;
        this.lstHospitales = resp.hospitales;
      })
  }
}
