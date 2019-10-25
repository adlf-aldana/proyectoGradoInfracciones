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
import * as firebase from 'firebase/app';

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

      var ref = firebase.database().ref('marcaVehiculos')
      var existe = false;
      // Comprobando si existe o no el cargo
      ref.orderByChild('nombreMarcaVehiculos').equalTo(this.servicioServices.seleccionarMarcaVehiculo.nombreMarcaVehiculos).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'La marca ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        if (marcaVehicular.value.$key == null) {
          this.servicioServices.insertMarcaVehiculo(marcaVehicular.value)
          this.notificaciones.success('Exitosamencargote', 'Marca guardado correctamente', {
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
  }

  resetForm(marcaVehicular ? : NgForm) {
    if (marcaVehicular != null) {
      marcaVehicular.reset();
      this.servicioServices.seleccionarMarcaVehiculo = new MarcaVehiculos();
    }
  }

}
