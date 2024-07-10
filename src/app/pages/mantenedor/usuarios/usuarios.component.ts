import { Component, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modalmagen.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  totalUsuarios: number = 0;
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  @ViewChild('templateImg', { static: false })
  templateSubirImagen: TemplateRef<any>;
  bsModalRef: BsModalRef;
  tipo: 'usuarios'|'medicos'|'hospitales';
  id: string;
  img: string;

  paginaActual: number = 0;
  cargando: boolean = true;

  constructor(
    public usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    public modalImagenService: ModalImagenService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.paginaActual)
      .subscribe((resp) => {
        if(resp.ok === true) {
          this.totalUsuarios = resp.total;
          this.usuarios = resp.usuarios;
          this.usuariosTemp = resp.usuarios;
          this.cargando = false;
        }else {
          this.totalUsuarios = 0;
          this.usuarios = [];
        }
      })
  }

  cambiarPagina(valor: number){
    this.paginaActual += valor;

    if(this.paginaActual < 0) {
      this.paginaActual = 0;
    } else if(this.paginaActual >= this.totalUsuarios) {
      this.paginaActual -= valor;
    }

    this.obtenerUsuarios();
  }

  buscar(termino: string){

    if(termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

      this.busquedasService.buscar('usuarios', termino)
      .subscribe((resp: any) => {
        if(resp.ok === true) {
          this.usuarios = resp.usuarios
        }
      })

  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: '¿Está seguro/a?',
      text: 'Se eliminará el usuario seleccionado.',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    })
    .then((res) => {
      if(res.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe((resp) => {

            if(resp.ok == true) {
              Swal.fire({
                title: 'Éxito!',
                text: 'Se ha eliminado el usuario seleccionado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
              })
              .then((r) => {
                if(r.isConfirmed) {
                  this.obtenerUsuarios();
                }
              })
            }
          })

      } else {
        Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
      }
    })
    .catch(() => {
      Swal.fire('Error', 'No se eliminó el usuario.', 'error');
    })
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.cambiarRole(usuario)
      .subscribe((resp: any) => {
        if(resp.ok === true) {

        } else {

        }
      })
  }

  abrirModal(usuario: Usuario){

    this.tipo = 'usuarios';
    this.id = usuario.uid;

    if(usuario.img == undefined) {
      this.img = usuario.imagenUrl;
    } else {
      if(usuario.img.includes('https')) {
        this.img = usuario.img;
      } else {
        this.img = `${base_url}/upload/${this.tipo}/${usuario.img}`
      }
    }

    this.bsModalRef = this.modalService.show(this.templateSubirImagen, {
      class: 'modal-lg',
      backdrop: true,
      ignoreBackdropClick: true,
    });
  }
}
