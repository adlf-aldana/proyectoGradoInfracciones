import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Tipo
} from 'src/app/models/tipoServicioVehiculo/tipo';
import {
  NotificationsService
} from 'angular2-notifications';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {

  servicioVehicular: FormGroup

  get nombreTipoServicio() {
    return this.servicioVehicular.get('nombreTipoServicio')
  }

  constructor(
    public serviciosService: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder
  ) {
    this.servicioVehicular = this.builder.group({
      $key: [],
      nombreTipoServicio: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.serviciosService.getServiciosVehiculares()
    this.resetForm()
  }

  agregarServicioVehiculo(servicioVehicular: NgForm) {
    if (servicioVehicular.valid) {

      var ref = firebase.database().ref('serviciosVehiculares')
      var existe = false;
      // Comprobando si existe o no el cargo
      ref.orderByChild('nombreTipoServicio').equalTo(this.serviciosService.seleccionarServicioVehicular.nombreTipoServicio).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'El servicio ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        if (servicioVehicular.value.$key == null) {
          this.serviciosService.insertTipoServicioVehicular(servicioVehicular.value)
          this.notificaciones.success('Exitosamente', 'Servicio guardado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          this.serviciosService.updateTipoServicioVehicular(servicioVehicular.value)
          this.notificaciones.success('Exitosamente', 'Servicio actualizado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        }
        this.resetForm(servicioVehicular)
      }
    }
  }

  resetForm(servicioVehicular ? : NgForm) {
    if (servicioVehicular != null) {
      servicioVehicular.reset();
      this.serviciosService.seleccionarServicioVehicular = new Tipo();
    }
  }
}
