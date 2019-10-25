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
  TipoVehiculo
} from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import {
  NotificationsService
} from 'angular2-notifications';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-add-tipo-vehiculo',
  templateUrl: './add-tipo-vehiculo.component.html',
  styleUrls: ['./add-tipo-vehiculo.component.css']
})
export class AddTipoVehiculoComponent implements OnInit {


  tipoVehiculo: FormGroup

  get nombreTipoVehiculo() {
    return this.tipoVehiculo.get('nombreTipoVehiculo')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder) {
    this.tipoVehiculo = this.builder.group({
      $key: [],
      nombreTipoVehiculo: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    this.resetForm()
  }

  agregarTipoVehiculo(tipoVehicular: NgForm) {
    if (tipoVehicular.valid) {
      var ref = firebase.database().ref('tipoVehiculos')
      var existe = false;
      // Comprobando si existe o no el cargo
      ref.orderByChild('nombreTipoVehiculo').equalTo(this.servicioServices.seleccionarTipoVehiculo.nombreTipoVehiculo).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'El tipo de vehiculo ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        if (tipoVehicular.value.$key == null) {
          this.servicioServices.insertTipoVehiculo(tipoVehicular.value)
          this.notificaciones.success('Exitosamente', 'Tipo de servicio agregado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          this.servicioServices.updateTipoVehiculo(tipoVehicular.value)
          this.notificaciones.success('Exitosamente', 'Tipo de Servicio actualizado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        }
        this.resetForm(tipoVehicular)
      }
    }
  }

  resetForm(tipoVehicular ? : NgForm) {
    if (tipoVehicular != null) {
      tipoVehicular.reset();
      this.servicioServices.seleccionarTipoVehiculo = new TipoVehiculo();
    }
  }

}
