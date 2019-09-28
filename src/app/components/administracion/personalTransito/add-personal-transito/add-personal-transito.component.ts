import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm } from '@angular/forms';
import { Personal } from 'src/app/models/personalTransito/personal';

@Component({
  selector: 'app-add-personal-transito',
  templateUrl: './add-personal-transito.component.html',
  styleUrls: ['./add-personal-transito.component.css']
})
export class AddPersonalTransitoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService) { }

  ngOnInit() {
    this.servicioServices.getPersonal();
  }

  addPersonalTransito(servicioPersonalTransito: NgForm) {
    if (servicioPersonalTransito.value.$key == null)
      this.servicioServices.insertPersonal(servicioPersonalTransito.value)
    else
      this.servicioServices.updatePersonal(servicioPersonalTransito.value)
    this.resetForm(servicioPersonalTransito)
  }

  resetForm(servicioPersonalTransito ? : NgForm) {
    if (servicioPersonalTransito != null) {
      servicioPersonalTransito.reset();
      this.servicioServices.seleccionarPersonal = new Personal();
    }
  }

}
