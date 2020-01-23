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
import * as crypto from 'crypto-js'
import {Router} from '@angular/router'
import {AuthService} from '../../../../../services/auth.service'

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
    public builder: FormBuilder,
    public router: Router,
    public authService: AuthService) {
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
          this.obteniendoDatosPersonal(0, marcaVehicular.value.nombreMarcaVehiculos)
          this.servicioServices.insertMarcaVehiculo(marcaVehicular.value)
          this.notificaciones.success('Exitosamencargote', 'Marca guardado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        } else {
          this.obteniendoDatosPersonal(1, marcaVehicular.value.nombreMarcaVehiculos)
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
                  if (i == 0) idu = "Inserto marca: ";
                  else if (i == 1) idu = "Actualizo marca: ";
                  else if (i == 2) idu = "Elimino marca: ";

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
                        this.servicioServices.seleccionarMarcaVehiculo.nombreMarcaVehiculos
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + cargo
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
