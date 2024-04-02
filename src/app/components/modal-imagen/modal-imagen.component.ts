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
      text: 'Se actualizará su foto de perfil.',
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
              text: 'Se ha actualizado su foto perfil.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })
            .then((r) => {
              if(r.isConfirmed) {
                // this.usuario.img = data.nombreArchivo;
                this.imagenEv = null;
                this.cerrar();
                this.actualizarUsuarios();
              }
            })
          } else {
            Swal.fire('Error', 'No se actualizó la foto de perfil.', 'error');
          }
        }).catch(() => {
          Swal.fire('Error', 'No se actualizó la foto de perfil.', 'error');
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

}
