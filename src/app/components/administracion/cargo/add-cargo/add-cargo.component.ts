import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Cargos } from 'src/app/models/cargoPersonal/cargos';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-add-cargo',
  templateUrl: './add-cargo.component.html',
  styleUrls: ['./add-cargo.component.css']
})
export class AddCargoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService) { }

  ngOnInit() {
    this.servicioServices.getCodigoCargo();
    this.resetForm();
  }

   agregarCargo(cargo: NgForm) {     
    if (cargo.value.$key == null)
      this.servicioServices.insertCargos(cargo.value)
    else
      this.servicioServices.updateCargos(cargo.value)
    this.resetForm(cargo)
  }

  resetForm(cargo ? : NgForm) {
    if (cargo != null) {
      cargo.reset();
      this.servicioServices.seleccionarCargo = new Cargos();
    }
  }

}
