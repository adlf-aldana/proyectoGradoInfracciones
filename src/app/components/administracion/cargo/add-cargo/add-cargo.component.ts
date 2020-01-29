import { Component, OnInit } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Cargos } from "src/app/models/cargoPersonal/cargos";
import { ServiciosService } from "src/app/services/servicios.service";
import { AuthService } from "src/app/services/auth.service";
import { NotificationsService } from "angular2-notifications";
import { Router } from "@angular/router";
import * as crypto from "crypto-js";

import * as firebase from "firebase/app";

@Component({
  selector: "app-add-cargo",
  templateUrl: "./add-cargo.component.html",
  styleUrls: ["./add-cargo.component.css"]
})
export class AddCargoComponent implements OnInit {
  validando: FormGroup;

  get cargo() {
    return this.validando.get("cargo");
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.validando = this.builder.group({
      $key: [],
      cargo: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ]
    });
    // this.obteniendoDatosPersonal();
    // // console.log(this.datosPersonal.cedula);

    // this.datosPersonal.forEach(element =>{
    //   console.log(element);
    // })
    // console.log("da");
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
                  if (i == 0) idu = "Inserto cargo: ";
                  else if (i == 1) idu = "Actualizo cargo: ";
                  else if (i == 2) idu = "Elimino cargo: ";

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
                        this.servicioServices.seleccionarCargo.cargo
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.servicioServices.seleccionarCargo.cargo
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

  ngOnInit() {
    this.servicioServices.getCargo();
    this.resetForm();
  }

  agregarCargo(cargo: NgForm) {
    var keySecret = "proyectoGradoUsfxTransito";
    if (cargo.valid) {
      var ref = firebase.database().ref("cargosTransito");
      var existe = false;

      ref
        .orderByChild("cargo")
        .equalTo(this.servicioServices.seleccionarCargo.cargo)
        .on("child_added", snap => {
          existe = true;
        });

      if (existe) {
        this.notificaciones.error("Error", "El cargo ya existe", {
          timeOut: 3000,
          showProgressBar: true
        });
      } else {
        if (cargo.value.$key == null) {
          this.servicioServices.insertCargos(cargo.value);
          this.notificaciones.success(
            "Exitosamente",
            "Cargo guardado correctamente",
            {
              timeOut: 3000,
              showProgressBar: true
            }
          );
          this.obteniendoDatosPersonal(0);
        } else {
          var ref = firebase.database().ref("cargosTransito");
          ref
            .orderByKey()
            .equalTo(cargo.value.$key)
            .on("child_added", snap => {
              let c = snap.val().cargo;
              this.obteniendoDatosPersonal(1, crypto.AES.decrypt(c, this.keySecret.trim()).toString(crypto.enc.Utf8));
            });

          this.servicioServices.updateCargos(cargo.value);
          this.notificaciones.success(
            "Exitosamente",
            "Cargo actualizado correctamente",
            {
              timeOut: 3000,
              showProgressBar: true
            }
          );
        }
        this.resetForm(cargo);
      }
    } else {
      this.servicioServices.updateCargos(cargo.value);
      this.notificaciones.success("Error", "Cargo es un campo obligatorio", {
        timeOut: 3000,
        showProgressBar: true
      });
    }
  }

  resetForm(cargo?: NgForm) {
    if (cargo != null) {
      cargo.reset();
      this.servicioServices.seleccionarCargo = new Cargos();
    }
  }
}

// if (cargo.value.$key == null) {
//   this.servicioServices.insertCargos(cargo.value)
//   this.notificaciones.success('Exitosamente', 'Cargo guardado correctamente', {
//     timeOut: 3000,
//     showProgressBar: true
//   })
// } else {
//   this.servicioServices.updateCargos(cargo.value)
//   this.notificaciones.success('Exitosamente', 'Cargo actualizado correctamente', {
//     timeOut: 3000,
//     showProgressBar: true
//   })
// }
// this.resetForm(cargo)
// })
// } else {
// this.servicioServices.updateCargos(cargo.value)
// this.notificaciones.success('Error', 'Cargo es un campo obligatorio', {
// timeOut: 3000,
// showProgressBar: true
// }
