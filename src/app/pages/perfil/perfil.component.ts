import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagen: File;
  public imagenValida: boolean = undefined;
  public imgTemp: any;
  imagenEv: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit() {
    this.perfilForm = this.fb.group({
      nombre: new FormControl(this.usuario.nombre, [Validators.required]),
      email: new FormControl(this.usuario.email, [Validators.email, Validators.required])
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.perfilForm.controls;
  }

  guardarPerfil(){
    if(this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    } else {
      Swal.fire({
        title: '¿Está seguro/a?',
        text: 'Se actualizará su perfil.',
        icon: 'question',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
    })
    .then((r) => {
      if(r.isConfirmed) {
        this.usuarioService.actualizarUsuario(this.perfilForm.value)
        .subscribe((resp: any) => {
          if(resp.ok === true) {
            Swal.fire({
              title: 'Éxito!',
              text: 'Se ha actualizado su perfil.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            })

            let { nombre, email } = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;
          } else {
            Swal.fire('Error', 'No se actualizó el perfil.', 'error');
          }
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        })
      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
      }
    })
    }
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
        this.fileUploadService.actualizarFoto(this.imagen, 'usuarios', this.usuario.uid)
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
                this.usuario.img = data.nombreArchivo;
                this.imagenEv = null;
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
}
