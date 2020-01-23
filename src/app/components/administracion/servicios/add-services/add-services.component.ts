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
import * as crypto from 'crypto-js'
import {AuthService} from '../../../../services/auth.service'
import {Router} from '@angular/router' 


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
    public builder: FormBuilder,
    public router: Router,
    public authService: AuthService,
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
          this.obteniendoDatosPersonal(0)
          this.serviciosService.insertTipoServicioVehicular(servicioVehicular.value)
          this.notificaciones.success('Exitosamente', 'Servicio guardado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          this.obteniendoDatosPersonal(1, servicioVehicular.value.nombreTipoServicio)
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
                  if (i == 0) idu = "Inserto servicio: ";
                  else if (i == 1) idu = "Actualizo servicio: ";
                  else if (i == 2) idu = "Elimino servicio: ";

                  if (i == 1) {
                    this.serviciosService.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        cargo + ' a ' + this.serviciosService.seleccionarServicioVehicular.nombreTipoServicio
                    );
                  } else {
                    this.serviciosService.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.serviciosService.seleccionarServicioVehicular.nombreTipoServicio
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
