import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NgForm, FormGroup, FormBuilder, Validators
} from '@angular/forms';
import {
  Tipo
} from 'src/app/models/tipoServicioVehiculo/tipo';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {

  servicioVehicular: FormGroup

  constructor(
    public serviciosService: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder
    )
    {
      this.servicioVehicular = this.builder.group({
        $key: [],
        nombreTipoServicio:['', Validators.required]
      })
    }

  ngOnInit() {
    this.serviciosService.getServiciosVehiculares()
    this.resetForm()
  }

  agregarServicioVehiculo(servicioVehicular: NgForm) {
    if (servicioVehicular.value.$key == null){
      this.serviciosService.insertTipoServicioVehicular(servicioVehicular.value)
      this.notificaciones.success('Exitosamente','Servicio guardado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    else{
      this.serviciosService.updateTipoServicioVehicular(servicioVehicular.value)
      this.notificaciones.success('Exitosamente','Servicio actualizado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    this.resetForm(servicioVehicular)
  }

  resetForm(servicioVehicular ? : NgForm) {
    if (servicioVehicular != null) {
      servicioVehicular.reset();
      this.serviciosService.seleccionarServicioVehicular = new Tipo();
    }
  }
}