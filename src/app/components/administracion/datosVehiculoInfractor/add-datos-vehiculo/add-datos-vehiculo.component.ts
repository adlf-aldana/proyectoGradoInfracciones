import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  NgForm
} from '@angular/forms';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NotificationsService
} from 'angular2-notifications';
import {
  DateAdapter
} from '@angular/material';
import {
  DatosVehiculo
} from 'src/app/models/datosVehiculo/datos-vehiculo';

@Component({
  selector: 'app-add-datos-vehiculo',
  templateUrl: './add-datos-vehiculo.component.html',
  styleUrls: ['./add-datos-vehiculo.component.css']
})
export class AddDatosVehiculoComponent implements OnInit {
  datosVehiculo: FormGroup

  get $key() {
    return this.datosVehiculo.get('$key')
  }
  get tipo() {
    return this.datosVehiculo.get('tipo')
  }
  get marca() {
    return this.datosVehiculo.get('marca')
  }
  get color() {
    return this.datosVehiculo.get('color')
  }
  get placa() {
    return this.datosVehiculo.get('placa')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private _adapter: DateAdapter < any > ) {
    this.datosVehiculo = this.builder.group({
        $key: [],
        tipo: [''],
        marca: [],
        color: [],
        placa: [],
        nombreInfractor: [],
        apPaternoInfractor: [],
        apMaternoInfractor: [],
        numLicencia: [],
        sexoInfractor: [],
       fechaNacimientoInfractor: [],
      celularInfractor: [],
      direccionInfractor: []
    })

}

ngOnInit() {
  this.servicioServices.getDatosVehiculo();
}

addDatosVehiculo(datosVehiculo: NgForm) {
  if (datosVehiculo.valid) {
    if (datosVehiculo.value.$key == null) {
      this.servicioServices.insertDatosVehiculo(datosVehiculo.value)
      this.notificaciones.success('Exitosamente', 'Datos guardados correctamente', {
        timeOut: 3000,
        showProgressBar: true
      })
    } else {
      this.servicioServices.updateDatosVehiculo(datosVehiculo.value)
      this.notificaciones.success('Exitosamente', 'Datos actualizados correctamente', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
    this.resetForm(datosVehiculo)
  } else {
    console.log('Error no valido');

  }
}

resetForm(datosVehiculo ? : NgForm) {
  if (datosVehiculo != null) {
    datosVehiculo.reset();
    this.servicioServices.seleccionarDatosVehiculo = new DatosVehiculo();
  }
}

}
