import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MedicoService } from '../../../services/medico.service'
import { Medico } from '../../../models/medico.model'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
const base_url = environment.base_url;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  lstMedicos: Medico[] = [];
  lstMedicosTemp: Medico[] = [];
  cargando: boolean = true;
  @ViewChild('templateImg', { static: false })
  templateSubirImagen: TemplateRef<any>;
  bsModalRef: BsModalRef;
  tipo: 'usuarios'|'medicos'|'hospitales';
  id: string;
  img: string;

  constructor(
    private medicoService: MedicoService,
    private modalService: BsModalService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit() {
    this.obtenerMedicos();
  }

  obtenerMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe((resp) => {
        if(resp.ok === true) {
          this.lstMedicos = resp.medicos;
          this.lstMedicosTemp = resp.medicos;
          this.cargando = false;
        } else {
          this.lstMedicos = [];
          this.cargando = false;
        }
      })
  }

  abrirModalImagen(medico: Medico){
    this.tipo = 'medicos';
    this.id = medico._id;


    if(medico.img == '' || medico.img == undefined) {
      medico.img = `${base_url}/upload/${this.tipo}/no-img`;
      this.img = medico.img;
    } else {
      this.img = `${base_url}/upload/${this.tipo}/${medico.img}`;
    }

    this.bsModalRef = this.modalService.show(this.templateSubirImagen, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  buscar(termino: string){
    if(termino.length === 0) {
      return this.lstMedicos = this.lstMedicosTemp;
    }

    this.busquedasService.buscar('medicos', termino)
    .subscribe((resp: any) => {
      if(resp.ok === true) {
        this.lstMedicos = resp.medicos
      }
    })
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se eliminará el médico seleccionado.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((r) => {
      if(r.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id)
          .subscribe((resp) => {
            if(resp.ok === true) {
              Swal.fire({
                title: 'Éxito!',
                text: 'Se ha eliminado el médico seleccionado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              })
              .then((r) => {
                if(r.isConfirmed) {
                  this.obtenerMedicos();
                }
              })
            } else {
              Swal.fire('Error', 'No se eliminó el médico.', 'error');
            }
          })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
      }
    }).catch(() => {
      Swal.fire('Error', 'No se eliminó el médico.', 'error');
    })
  }

}
