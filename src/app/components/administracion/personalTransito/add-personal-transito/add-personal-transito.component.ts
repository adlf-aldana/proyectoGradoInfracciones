import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Personal } from 'src/app/models/personalTransito/personal';
import { NotificationsService } from 'angular2-notifications';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-add-personal-transito',
  templateUrl: './add-personal-transito.component.html',
  styleUrls: ['./add-personal-transito.component.css']
})
export class AddPersonalTransitoComponent implements OnInit {
  
  personalTransito: FormGroup
  
  constructor(
    public servicioServices:ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private _adapter: DateAdapter<any>) 
    {
      this.personalTransito = this.builder.group({
        $key: [],
        nombrePersonal: ['', Validators.required],
        apPaternoPersonal: ['', Validators.required],
        apMaternoPersonal: ['', Validators.required],
        ciPersonal: ['', Validators.required],
        sexoPersonal: [''],
        celularPersonal: ['', Validators.required],
        fechaNacimientoPersonal: [''],
        direccionPersonal: ['', Validators.required]
      })
    }

  ngOnInit() {
    this.servicioServices.getPersonal();
  }

  addPersonalTransito(servicioPersonalTransito: NgForm) {
    if (servicioPersonalTransito.value.$key == null){
      this.servicioServices.insertPersonal(servicioPersonalTransito.value)
      this.notificaciones.success('Exitosamente','Datos guardados correctamente',{
        timeOut: 3000,
        showProgressBar:true
      })
    }
    else{
      this.servicioServices.updatePersonal(servicioPersonalTransito.value)
      this.notificaciones.success('Exitosamente','Datos actualizados correctamente',{
        timeOut: 3000,
        showProgressBar:true
      })
    }
    this.resetForm(servicioPersonalTransito)
  }
  
  resetForm(servicioPersonalTransito ? : NgForm) {
    if (servicioPersonalTransito != null) {
      servicioPersonalTransito.reset();
      this.servicioServices.seleccionarPersonal = new Personal();
    }
  }
}