import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  NgForm,
  Validators
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
  get nombreInfractor() {
    return this.datosVehiculo.get('nombreInfractor')
  }
  get apPaternoInfractor() {
    return this.datosVehiculo.get('apPaternoInfractor')
  }
  get apMaternoInfractor() {
    return this.datosVehiculo.get('apMaternoInfractor')
  }
  get numLicencia() {
    return this.datosVehiculo.get('numLicencia')
  }
  get sexoInfractor() {
    return this.datosVehiculo.get('sexoInfractor')
  }
  get fechaNacimientoInfractor() {
    return this.datosVehiculo.get('fechaNacimientoInfractor')
  }
  get celularInfractor() {
    return this.datosVehiculo.get('celularInfractor')
  }
  get direccionInfractor() {
    return this.datosVehiculo.get('direccionInfractor')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private _adapter: DateAdapter < any > ) {
    this.datosVehiculo = this.builder.group({
        $key: [],
        tipo: ['', Validators.required],
        marca: ['', Validators.required],
        color: ['', Validators.required],
        placa: ['', Validators.required],
        nombreInfractor: ['', Validators.required],
        apPaternoInfractor: ['', Validators.required],
        apMaternoInfractor: ['', Validators.required],
        numLicencia: ['', Validators.required],
        sexoInfractor: ['', Validators.required],
       fechaNacimientoInfractor: ['', Validators.required],
      celularInfractor: [],
      direccionInfractor: [],
    })

}

ngOnInit() {
  this.servicioServices.getDatosVehiculo();
  this.resetForm()
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
