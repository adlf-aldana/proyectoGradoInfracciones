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
  MarcaVehiculos
} from 'src/app/models/marcaVehiculos/marca-vehiculos';
import {
  NotificationsService
} from 'angular2-notifications';

@Component({
  selector: 'app-add-marca-vehiculo',
  templateUrl: './add-marca-vehiculo.component.html',
  styleUrls: ['./add-marca-vehiculo.component.css']
})
export class AddMarcaVehiculoComponent implements OnInit {

  marcaVehiculo: FormGroup

  get nombreMarcaVehiculos() {
    return this.marcaVehiculo.get('nombreMarcaVehiculos')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder) {
    this.marcaVehiculo = this.builder.group({
      $key: [],
      nombreMarcaVehiculos: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.servicioServices.getMarcaVehiculo();
    this.resetForm();
  }

  agregarMarcaVehiculo(marcaVehicular: NgForm) {
    if (marcaVehicular.valid) {
      if (marcaVehicular.value.$key == null) {
        this.servicioServices.insertMarcaVehiculo(marcaVehicular.value)
        this.notificaciones.success('Exitosamente', 'Marca guardado correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        this.servicioServices.updateMarcaVehiculo(marcaVehicular.value)
        this.notificaciones.success('Exitosamente', 'Marca actualizado correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      this.resetForm(marcaVehicular)
    }
  }

  resetForm(marcaVehicular ? : NgForm) {
    if (marcaVehicular != null) {
      marcaVehicular.reset();
      this.servicioServices.seleccionarMarcaVehiculo = new MarcaVehiculos();
    }
  }

}
