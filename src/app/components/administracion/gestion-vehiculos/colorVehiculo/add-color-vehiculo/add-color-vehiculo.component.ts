import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm } from '@angular/forms';
import { ColorVehiculos } from 'src/app/models/colorVehiculos/color-vehiculos';

@Component({
  selector: 'app-add-color-vehiculo',
  templateUrl: './add-color-vehiculo.component.html',
  styleUrls: ['./add-color-vehiculo.component.css']
})
export class AddColorVehiculoComponent implements OnInit {

  constructor(public servicioServices: ServiciosService) { }

  ngOnInit() {
    this.servicioServices.getColorVehiculo();
    this.resetForm();
  }

  agregaColorVehiculo(colorVehicular: NgForm) {
    if (colorVehicular.value.$key == null)
      this.servicioServices.insertColorVehiculo(colorVehicular.value)
    else
      this.servicioServices.updateColorVehiculo(colorVehicular.value)
    this.resetForm(colorVehicular)
  }

  resetForm(colorVehicular ? : NgForm) {
    if (colorVehicular != null) {
      colorVehicular.reset();
      this.servicioServices.seleccionarColorVehiculo = new ColorVehiculos();
    }
  }

}