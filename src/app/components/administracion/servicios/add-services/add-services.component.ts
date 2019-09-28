import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NgForm
} from '@angular/forms';
import {
  Tipo
} from 'src/app/models/tipoServicioVehiculo/tipo';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {

  constructor(public serviciosService: ServiciosService) {}

  ngOnInit() {
    this.serviciosService.getServiciosVehiculares()
    this.resetForm()
  }

  agregarServicioVehiculo(servicioVehicular: NgForm) {
    if (servicioVehicular.value.$key == null)
      this.serviciosService.insertTipoServicioVehicular(servicioVehicular.value)
    else
      this.serviciosService.updateTipoServicioVehicular(servicioVehicular.value)
    this.resetForm(servicioVehicular)
  }

  resetForm(servicioVehicular ? : NgForm) {
    if (servicioVehicular != null) {
      servicioVehicular.reset();
      this.serviciosService.seleccionarServicioVehicular = new Tipo();
    }
  }
}