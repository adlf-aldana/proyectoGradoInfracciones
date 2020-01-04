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
import { AngularFireDatabase } from 'angularfire2/database';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import { Tipo } from 'src/app/models/tipoServicioVehiculo/tipo';
import { MarcaVehiculos } from 'src/app/models/marcaVehiculos/marca-vehiculos';
import { ColorVehiculos } from 'src/app/models/colorVehiculos/color-vehiculos';
import * as firebase from 'firebase/app';

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

  tipoVehiculos: TipoVehiculo[];
  marcaVehiculos: MarcaVehiculos[];
  colorVehiculos: ColorVehiculos[];
  serviciosVehiculares: Tipo[];

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    public db: AngularFireDatabase,
    private _adapter: DateAdapter<any>) {
    this.datosVehiculo = this.builder.group({
      $key: [],
      tipo: ['', [Validators.required, Validators.min(7), Validators.maxLength(11)]],
      marca: ['', [Validators.required]],
      color: ['', [Validators.required]],
      placa: ['', [Validators.required]],
      tipoServicio: ['', [Validators.required]],

      nombreInfractor: ['',],
      apPaternoInfractor: ['',],
      apMaternoInfractor: ['',],
      celularInfractor: ['',],
      direccionInfractor: ['',],

      numLicencia: ['',],
      sexoInfractor: ['',],
      fechaNacimientoInfractor: ['',],

    })


    db.list('tipoVehiculos').snapshotChanges()
      .subscribe(item => {
        this.tipoVehiculos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.tipoVehiculos.push(x as TipoVehiculo);
        })
      })

    db.list('marcaVehiculos').snapshotChanges()
      .subscribe(item => {
        this.marcaVehiculos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.marcaVehiculos.push(x as MarcaVehiculos);
        })
      })
    db.list('colorVehiculos').snapshotChanges()
      .subscribe(item => {
        this.colorVehiculos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.colorVehiculos.push(x as ColorVehiculos);
        })
      })
    db.list('serviciosVehiculares').snapshotChanges()
      .subscribe(item => {
        this.serviciosVehiculares = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.serviciosVehiculares.push(x as Tipo);
        })
      })
  }

  ngOnInit() {
    this.servicioServices.getDatosVehiculo();
    this.resetForm()
  }

  addDatosVehiculo(datosVehiculo: NgForm) {
    if (datosVehiculo.valid) {

      var ref = firebase.database().ref('datosVehiculo')
      var existe = false;
      // Comprobando si existe o no el cargo
      ref.orderByChild('placa').equalTo(this.servicioServices.seleccionarDatosVehiculo.placa).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'La placa ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      else {

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
      }
    } else {
      console.log('Error no valido');
    }
  }

  resetForm(datosVehiculo?: NgForm) {
    if (datosVehiculo != null) {
      datosVehiculo.reset();
      this.servicioServices.seleccionarDatosVehiculo = new DatosVehiculo();
    }
  }

}
