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
  ColorVehiculos
} from 'src/app/models/colorVehiculos/color-vehiculos';
import {
  NotificationsService
} from 'angular2-notifications';
import * as firebase from 'firebase/app';
import * as crypto from 'crypto-js'
import {Router} from '@angular/router'
import {AuthService} from '../../../../../services/auth.service'

@Component({
  selector: 'app-add-color-vehiculo',
  templateUrl: './add-color-vehiculo.component.html',
  styleUrls: ['./add-color-vehiculo.component.css']
})
export class AddColorVehiculoComponent implements OnInit {

  colorVehiculo: FormGroup

  get nombreColorVehiculo() {
    return this.colorVehiculo.get('nombreColorVehiculo')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    public router: Router,
    public authService: AuthService) {
    this.colorVehiculo = this.builder.group({
      $key: [],
      nombreColorVehiculo: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.servicioServices.getColorVehiculo();
    this.resetForm();
  }

  agregaColorVehiculo(colorVehicular: NgForm) {
    if (colorVehicular.valid) {

      var ref = firebase.database().ref('colorVehiculos')
      var existe = false;
      // Comprobando si existe o no el cargo
      ref.orderByChild('nombreColorVehiculo').equalTo(this.servicioServices.seleccionarColorVehiculo.nombreColorVehiculo).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'El color ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {

        if (colorVehicular.value.$key == null) {
          this.obteniendoDatosPersonal(0)
          this.servicioServices.insertColorVehiculo(colorVehicular.value)
          this.notificaciones.success('Exitosamente', 'Color guardado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          // this.obteniendoDatosPersonal(1, colorVehicular.value.nombreColorVehiculo)
          var ref = firebase.database().ref("colorVehiculos");
          ref
            .orderByKey()
            .equalTo(colorVehicular.value.$key)
            .on("child_added", snap => {
              let servicio = snap.val().nombreColorVehiculo;

              this.obteniendoDatosPersonal(1,
                crypto.AES.decrypt(servicio, this.keySecret.trim()).toString(crypto.enc.Utf8)
                );
            });
          this.servicioServices.updateColorVehiculo(colorVehicular.value)
          this.notificaciones.success('Exitosamente', 'Color actualizado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        }
        this.resetForm(colorVehicular)
      }
    }
  }

  resetForm(colorVehicular ? : NgForm) {
    if (colorVehicular != null) {
      colorVehicular.reset();
      this.servicioServices.seleccionarColorVehiculo = new ColorVehiculos();
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
                  if (i == 0) idu = "Inserto color: ";
                  else if (i == 1) idu = "Actualizo color: ";
                  else if (i == 2) idu = "Elimino colo: ";

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
                        this.servicioServices.seleccionarColorVehiculo.nombreColorVehiculo
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.servicioServices.seleccionarColorVehiculo.nombreColorVehiculo
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
