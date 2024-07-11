import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ModalImagenService } from '../../services/modalmagen.service'
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagen: File;
  public imagenValida: boolean = undefined;
  public imgTemp: any;
  imagenEv: any;

  @Input() img: any;
  @Input() tipo: any;
  @Input() id: any;
  @Output() cerrarModal = new EventEmitter<string>();
  @Output() obtenerUsuarios = new EventEmitter<any>();
  @Output() obtenerHospitales = new EventEmitter<any>();
  @Output() obtenerMedicos = new EventEmitter<any>();


  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {

  }

  adjuntarImagen(file: any) {
    if(!file.target.files[0]) {
      return this.imgTemp = null;
    }

    if(file.target.files[0].type === "image/jpeg" || file.target.files[0].type === "image/png" || file.target.files[0].type == "image/jpg") {
      this.imagenValida = true;
      this.imagen = file.target.files[0];

      let reader = new FileReader();
      reader.readAsDataURL(file.target.files[0]);

      reader.onloadend = () => {
        this.imgTemp = reader.result;
      }
    } else {
      this.imagenValida = false;
      this.imgTemp = null;
      file.target.value = '';
      this.imagen = undefined;
    }
  }

  guardarImagen(){
    Swal.fire({
      title: '¿Está seguro/a?',
      text:
      this.tipo == 'usuarios' ? 'Se actualizará su foto de perfil.'
      : this.tipo == 'hospitales' ? 'Se actualizará la imagen del hospital.'
      : 'Se actualizará la imagen del médico.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((resp) => {
      if(resp.isConfirmed) {
        this.fileUploadService.actualizarFoto(this.imagen, this.tipo, this.id)
        .then((data) => {
          if(data.ok == true) {
            Swal.fire({
              title: 'Éxito!',
              text:
              this.tipo == 'usuarios' ? 'Se ha actualizado su foto de perfil.'
              : this.tipo == 'hospitales' ? 'Se ha actualizado la imagen del hospital.'
              : 'Se ha actualizado la imagen del médico.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })
            .then((r) => {
              if(r.isConfirmed) {
                // this.usuario.img = data.nombreArchivo;
                this.imagenEv = null;
                this.cerrar();

                switch (this.tipo) {
                  case 'usuarios':
                    this.actualizarUsuarios();
                    break;

                  case 'hospitales':
                    this.actualizarHospitales();

                      break;

                  case 'medicos':
                    this.actualizarMedicos();
                    break;
                }
              }
            })
          } else {
            Swal.fire('Error',
              this.tipo == 'usuarios' ? 'No se actualizó su foto de perfil.'
              : this.tipo == 'hospitales' ? 'No se actualizó la imagen del hospital.'
              : 'No se actualizó la imagen del médico.',
              'error');
          }
        }).catch(() => {
          Swal.fire('Error',
          this.tipo == 'usuarios' ? 'No se actualizó su foto de perfil.'
          : this.tipo == 'hospitales' ? 'No se actualizó la imagen del hospital.'
          : 'No se actualizó la imagen del médico.',
          'error');
        })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
      }
    })
  }

  cerrar() {
    this.cerrarModal.emit();
  }

  actualizarUsuarios(){
    this.obtenerUsuarios.emit();
  }

  actualizarHospitales(){
    this.obtenerHospitales.emit();
  }

  actualizarMedicos(){
    this.obtenerMedicos.emit();
  }
}
