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
import * as crypto from 'crypto-js'
import {AuthService} from '../../../../../services/auth.service'
import {Router} from '@angular/router'

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
    public builder: FormBuilder,
    public authService: AuthService,
    public router: Router) {
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
          this.obteniendoDatosPersonal(0, tipoVehicular.value.nombreTipoVehiculo)
          this.servicioServices.insertTipoVehiculo(tipoVehicular.value)
          this.notificaciones.success('Exitosamente', 'Tipo de servicio agregado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          // this.obteniendoDatosPersonal(1, tipoVehicular.value.nombreTipoVehiculo)
          var ref = firebase.database().ref("tipoVehiculos");
          ref
            .orderByKey()
            .equalTo(tipoVehicular.value.$key)
            .on("child_added", snap => {
              let servicio = snap.val().nombreTipoVehiculo;

              this.obteniendoDatosPersonal(1,
                crypto.AES.decrypt(servicio, this.keySecret.trim()).toString(crypto.enc.Utf8)
                );
            });
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

  keySecret = "proyectoGradoUsfxTransito";

  datosPersonal: {
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    cargo: any;
  };

  public obteniendoDatosPersonal(i: number, cargo?: string) {
    let correo = this.authService.correo;

    var ref = firebase.database().ref("gestionUsuarios");
    var ref2 = firebase.database().ref("personalTransito");

    if (correo == null) {
      // console.log('error');
      this.router.navigate(["/"]);
    } else {
      ref
        .orderByChild("correoUsuario")
        // .equalTo(correo)
        .on("child_added", snap => {
          // console.log(snap.val().ciUsuario);
          if (
            crypto.AES.decrypt(
              snap.val().correoUsuario,
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8) === correo
          ) {
            
            ref2.orderByChild("ciPersonal").on("child_added", snap2 => {
              // console.log(crypto.AES.decrypt(snap2.val().ciPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8));
              if (
                crypto.AES.decrypt(
                  snap2.val().ciPersonal,
                  this.keySecret.trim()
                ).toString(crypto.enc.Utf8) === crypto.AES.decrypt(snap.val().ciUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8)
              ) {
                this.datosPersonal = {
                  cedula: snap2.val().ciPersonal,
                  nombre: snap2.val().nombrePersonal,
                  apPaterno: snap2.val().apPaternoPersonal,
                  apMaterno: snap2.val().apMaternoPersonal,
                  cargo: snap2.val().cargo
                };

                try {
                  let date = new Date();
                  let fechaInfraccion;
                  if (date.getMonth() + 1 < 10)
                    fechaInfraccion =
                      date.getDate() +
                      "/0" +
                      (date.getMonth() + 1) +
                      "/" +
                      date.getFullYear() +
                      " " +
                      date.getHours() +
                      ":" +
                      date.getMinutes() +
                      ":" +
                      date.getSeconds();
                  else
                    fechaInfraccion =
                      date.getDate() +
                      "/" +
                      (date.getMonth() + 1) +
                      "/" +
                      date.getFullYear() +
                      " " +
                      date.getHours() +
                      ":" +
                      date.getMinutes() +
                      ":" +
                      date.getSeconds();

                  let idu: String = "";
                  if (i == 0) idu = "Inserto tipo de vehiculo: ";
                  else if (i == 1) idu = "Actualizo tipo de vehiculo: ";
                  else if (i == 2) idu = "Elimino tipo de vehiculo: ";

                  if (i == 1) {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        cargo +
                        " a " +
                        this.servicioServices.seleccionarTipoVehiculo.nombreTipoVehiculo
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.servicioServices.seleccionarTipoVehiculo.nombreTipoVehiculo
                    );
                  }
                } catch (e) {
                  console.log("error " + e);
                }
              }
            });
          }
        });
    }
  }

}
