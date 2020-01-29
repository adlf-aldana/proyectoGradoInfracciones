import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import * as firebase from 'firebase/app'
import { Testigo } from 'src/app/models/Testigos/testigo';

@Component({
  selector: 'app-add-testigo',
  templateUrl: './add-testigo.component.html',
  styleUrls: ['./add-testigo.component.css']
})
export class AddTestigoComponent implements OnInit {

  validando: FormGroup
  
  get nombreTestigo() {
    return this.validando.get('nombreTestigo')
  }
  get apPaternoTestigo() {
    return this.validando.get('apPaternoTestigo')
  }
  get apMaternoTestigo() {
    return this.validando.get('apMaternoTestigo')
  }
  get cedulaIdentidadTestigo() {
    return this.validando.get('cedulaIdentidadTestigo')
  }
  get celularTestigo() {
    return this.validando.get('celularTestigo')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder) {
    this.validando = this.builder.group({
      $key: [],
      nombreTestigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      apPaternoTestigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      apMaternoTestigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      cedulaIdentidadTestigo: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      celularTestigo: [''],
    })
  }

  ngOnInit() {
    this.servicioServices.getTestigo();
    this.resetForm();
  }

  agregarTestigo(testigo: NgForm) {
    if (testigo.valid) {
      
      var ref = firebase.database().ref('testigos')
      var existe = false;
      // Comprobando si existe o no el cargo
        ref.orderByChild('cedulaIdentidadTestigo').equalTo(this.servicioServices.seleccionarTestigo.cedulaIdentidadTestigo).on("child_added", snap => 
        {
          existe=true;
        });

        if(existe){
          this.notificaciones.error('Error', 'El C.I. del testigo ya existe', {
              timeOut: 3000,
              showProgressBar: true
            })
        }
        else{
          if (testigo.value.$key == null) {
              this.servicioServices.insertTestigo(testigo.value)
              this.notificaciones.success('Exitosamente', 'Datos guardado correctamente', {
                timeOut: 3000,
                showProgressBar: true
              })
            } else {
              this.servicioServices.updateTestigo(testigo.value)
              this.notificaciones.error('Exitosamente', 'Datos actualizado correctamente', {
                timeOut: 3000,
                showProgressBar: true
              })
            }
            this.resetForm(testigo)
        }

      }else {
        // this.servicioServices.updateTestigo(testigo.value)
        this.notificaciones.success('Error', 'Debe completar los campos obligatorios', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
    }


    resetForm(cargo ? : NgForm) {
      if (cargo != null) {
        cargo.reset();
        this.servicioServices.seleccionarTestigo = new Testigo();
      }
    }
}
