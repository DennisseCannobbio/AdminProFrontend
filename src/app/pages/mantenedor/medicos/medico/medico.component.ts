import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  lstHospitales: any[] = [];
  hospitalSeleccionado: any;
  medicoSeleccionado: any;
  id: string;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = route.snapshot.paramMap.get('id');
  }

  ngOnInit() {

    this.obtenerHospitales();
    if(this.id != 'nuevo'){
      this.obtenerMedico();
    }

    this.medicoForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      hospital: new FormControl('', [Validators.required])
    })

    this.medicoForm.get('hospital').valueChanges
      .subscribe((id) =>{
        this.hospitalSeleccionado = this.lstHospitales.find(x => x._id === id);
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.medicoForm.controls;
  }

  obtenerHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe((resp: any) => {
        if(resp.ok === true) {
          this.lstHospitales = resp.hospitales;
        } else {
          this.lstHospitales = [];
        }
      })
  }

  obtenerMedico(){

    this.cargando = true;

    this.medicoService.cargarMedicoXId(this.id)
      .pipe(
        delay(100)
      )
      .subscribe((resp: any) => {
        if(resp.ok) {
          let {nombre, hospital: { _id }} = resp.medico;
          this.medicoSeleccionado = resp.medico;
          this.medicoForm.setValue({ nombre, hospital: _id});
          this.cargando = false;
        }
      })
  }

  guardar(){

    let form = this.medicoForm.getRawValue();

    if(this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      return;
    } else {
        Swal.fire({
          title: '¿Está seguro/a?',
          text: this.id == 'nuevo' ? 'Se creará el médico.' : 'Se actualizará el médico seleccionado.',
          icon: 'question',
          confirmButtonText: 'Aceptar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        })
        .then((r) => {
          if(r.isConfirmed) {
            if(this.id == 'nuevo') {
              this.medicoService.crearMedico(form.nombre, form.hospital)
              .subscribe((resp) => {
                if(resp.ok === true) {
                  Swal.fire({
                    title: 'Éxito!',
                    text: 'Se ha creado el médico.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                  })
                  .then((res) => {
                    if(res.isConfirmed) {
                      this.router.navigateByUrl('/dashboard/medicos')
                    }
                  })
                } else {
                  Swal.fire('Error', 'No se creó el médico.', 'error');
                }
              })
            } else {

                this.medicoService.actualizarMedico(this.id, form.nombre, form.hospital)
                  .subscribe((resp) => {
                    if(resp.ok === true) {
                      Swal.fire({
                        title: 'Éxito!',
                        text: 'Se ha actualizado el médico.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                      })
                      .then((res) => {
                        if(res.isConfirmed) {
                          this.ngOnInit();
                        }
                      })
                    } else {
                      Swal.fire('Error', 'No se actualizó el médico.', 'error');
                    }
                  })
            }

          } else {
            Swal.fire('Operación Cancelada', 'No se han realizado cambios.', 'error');
          }
        })
    }
  }

}
