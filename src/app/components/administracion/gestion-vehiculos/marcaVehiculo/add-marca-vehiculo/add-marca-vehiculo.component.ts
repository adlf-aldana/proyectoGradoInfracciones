import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm } from '@angular/forms';
import { MarcaVehiculos } from 'src/app/models/marcaVehiculos/marca-vehiculos';

@Component({
  selector: 'app-add-marca-vehiculo',
  templateUrl: './add-marca-vehiculo.component.html',
  styleUrls: ['./add-marca-vehiculo.component.css']
})
export class AddMarcaVehiculoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService) {}

  ngOnInit() {
    this.servicioServices.getMarcaVehiculo();
    this.resetForm();
  }

  agregarMarcaVehiculo(marcaVehicular: NgForm) {
    if (marcaVehicular.value.$key == null)
      this.servicioServices.insertMarcaVehiculo(marcaVehicular.value)
    else
      this.servicioServices.updateMarcaVehiculo(marcaVehicular.value)
    this.resetForm(marcaVehicular)
  }

  resetForm(marcaVehicular ? : NgForm) {
    if (marcaVehicular != null) {
      marcaVehicular.reset();
      this.servicioServices.seleccionarMarcaVehiculo = new MarcaVehiculos();
    }
  }

}