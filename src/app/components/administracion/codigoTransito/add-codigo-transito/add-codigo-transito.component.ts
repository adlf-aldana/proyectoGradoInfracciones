import { Component, OnInit } from '@angular/core';
 import { CodigoTransito } from 'src/app/models/codigoTransito/codigo-transito';
import {
  NgForm, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
 


@Component({
  selector: 'app-add-codigo-transito',
  templateUrl: './add-codigo-transito.component.html',
  styleUrls: ['./add-codigo-transito.component.css']
})
export class AddCodigoTransitoComponent implements OnInit {

  codigoTransito: FormGroup

  constructor(
    public servicioServices:ServiciosService, 
    public notificaciones:NotificationsService, 
    public builder:FormBuilder) 
  {
    this.codigoTransito = this.builder.group({
      $key: [],
      articulo: ['', Validators.required],
      numero: ['', Validators.required],
      descripcion: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.servicioServices.getCodigoTransito();
    this.resetForm()
  }

addCodigoTransito(servicioCodigoTransito: NgForm) {
    if (servicioCodigoTransito.value.$key == null){
      this.servicioServices.insertCodigosTransito(servicioCodigoTransito.value)
      this.notificaciones.success('Exitosamente','Item guardado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    else
    {
      this.servicioServices.updateCodigosTransito(servicioCodigoTransito.value)
      this.notificaciones.success('Exitosamente','Item actualizado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    this.resetForm(servicioCodigoTransito)
  }

  resetForm(servicioCodigoTransito ? : NgForm) {
    if (servicioCodigoTransito != null) {
      servicioCodigoTransito.reset();
      this.servicioServices.seleccionarCodigoTransito = new CodigoTransito();
    }
  }
}