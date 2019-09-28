import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm } from '@angular/forms';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';

@Component({
  selector: 'app-add-tipo-vehiculo',
  templateUrl: './add-tipo-vehiculo.component.html',
  styleUrls: ['./add-tipo-vehiculo.component.css']
})
export class AddTipoVehiculoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService) {}

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    this.resetForm()
  }

  agregarTipoVehiculo(tipoVehicular: NgForm) {
    if (tipoVehicular.value.$key == null)
      this.servicioServices.insertTipoVehiculo(tipoVehicular.value)
    else
      this.servicioServices.updateTipoVehiculo(tipoVehicular.value)
    this.resetForm(tipoVehicular)
  }

  resetForm(tipoVehicular ? : NgForm) {
    if (tipoVehicular != null) {
      tipoVehicular.reset();
      this.servicioServices.seleccionarTipoVehiculo = new TipoVehiculo();
    }
  }

}