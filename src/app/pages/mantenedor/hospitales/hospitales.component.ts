import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service'
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { BusquedasService } from 'src/app/services/busquedas.service';
const base_url = environment.base_url;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospitalesTemp: Hospital[] = [];
  cargando: boolean = true;
  nombreHospital: string = '';
  @ViewChild('modalAgregarHospital', { static: false })
  templateAgregarHospital: TemplateRef<any>;
  @ViewChild('templateImg', { static: false })
  templateSubirImagen: TemplateRef<any>;
  bsModalRef: BsModalRef;
  tipo: 'usuarios'|'medicos'|'hospitales';
  id: string;
  img: string;

  constructor(
    private hospitalService: HospitalService,
    public modalService: BsModalService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit() {
    this.obtenerHospitales();
  }

  obtenerHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe((resp) => {
        if(resp.ok) {
          this.cargando = false;
          this.hospitales = resp.hospitales;
          this.hospitalesTemp =  resp.hospitales;
        } else {
          this.cargando = false;
          this.hospitales = [];
        }
      })
  }

  actualizarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se actualizará el hospital seleccionado.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((r) => {
      if(r.isConfirmed) {
        this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe((resp) => {
          if(resp.ok === true) {
            Swal.fire({
              title: 'Éxito!',
              text: 'Se ha actualizado el hospital seleccionado.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })
            .then((r) => {
              if(r.isConfirmed) {
                this.obtenerHospitales();
              }
            })
          } else {
            Swal.fire('Error', 'No se actualizó el hospital.', 'error');
          }
        })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error')
        .then(() => {
          this.obtenerHospitales();
        });
      }
    }).catch(() => {
      Swal.fire('Error', 'No se actualizó el hospital.', 'error');
    })
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se eliminará el hospital seleccionado.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((r) => {
      if(r.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital._id)
          .subscribe((resp) => {
            if(resp.ok === true) {
              Swal.fire({
                title: 'Éxito!',
                text: 'Se ha eliminado el hospital seleccionado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              })
              .then((r) => {
                if(r.isConfirmed) {
                  this.obtenerHospitales();
                }
              })
            } else {
              Swal.fire('Error', 'No se eliminó el hospital.', 'error');
            }
          })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
      }
    }).catch(() => {
      Swal.fire('Error', 'No se eliminó el hospital.', 'error');
    })
  }

  abrirModalNuevoHospital(){
    this.bsModalRef = this.modalService.show(this.templateAgregarHospital, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  agregarHospital(){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se agregará un nuevo hospital.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((r) => {
      if(r.isConfirmed) {
        this.hospitalService.crearHospital(this.nombreHospital)
          .subscribe((resp) => {
            if(resp.ok === true) {
              Swal.fire({
                title: 'Éxito!',
                text: 'Se ha agregado un nuevo hospital.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              })
              .then((r) => {
                if(r.isConfirmed) {
                  this.obtenerHospitales();
                  this.bsModalRef.hide();
                  this.nombreHospital = '';
                }
              })
              .catch(() => {
                Swal.fire('Error', 'No se agregó el hospital.', 'error')
                  .then((r) => {
                    if(r.isConfirmed) {
                      this.bsModalRef.hide();
                      this.nombreHospital = '';
                    }
                  })
              })
            } else {
              Swal.fire('Error', 'No se agregó el hospital.', 'error')
                .then((r) => {
                  if(r.isConfirmed) {
                    this.bsModalRef.hide();
                    this.nombreHospital = '';
                  }
                })
            }
          })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error')
          .then((r) => {
            if(r.isConfirmed) {
              this.bsModalRef.hide();
              this.nombreHospital = '';
            }
          })
      }
    })
  }

  abrirModalImagen(hospital: Hospital){
    this.tipo = 'hospitales';
    this.id = hospital._id;


    if(hospital.img == '' || hospital.img == undefined) {
      hospital.img = `${base_url}/upload/${this.tipo}/no-img`;
      this.img = hospital.img;
    } else {
      this.img = `${base_url}/upload/${this.tipo}/${hospital.img}`;
    }


    this.bsModalRef = this.modalService.show(this.templateSubirImagen, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }

  buscar(termino: string){

    if(termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedasService.buscar('hospitales', termino)
    .subscribe((resp: any) => {
      if(resp.ok === true) {
        this.hospitales = resp.hospitales;
      }
    })

  }
}
