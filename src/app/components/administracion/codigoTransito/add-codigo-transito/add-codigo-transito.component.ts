import { Component, OnInit } from '@angular/core';
 import { CodigoTransito } from 'src/app/models/codigoTransito/codigo-transito';
import {
  NgForm
} from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
 


@Component({
  selector: 'app-add-codigo-transito',
  templateUrl: './add-codigo-transito.component.html',
  styleUrls: ['./add-codigo-transito.component.css']
})
export class AddCodigoTransitoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService) {}

  ngOnInit() {
    this.servicioServices.getCodigoTransito();
    this.resetForm()
  }

addCodigoTransito(servicioCodigoTransito: NgForm) {
    if (servicioCodigoTransito.value.$key == null)
      this.servicioServices.insertCodigosTransito(servicioCodigoTransito.value)
    else
      this.servicioServices.updateCodigosTransito(servicioCodigoTransito.value)
    this.resetForm(servicioCodigoTransito)
  }

  resetForm(servicioCodigoTransito ? : NgForm) {
    if (servicioCodigoTransito != null) {
      servicioCodigoTransito.reset();
      this.servicioServices.seleccionarCodigoTransito = new CodigoTransito();
    }
  }
}