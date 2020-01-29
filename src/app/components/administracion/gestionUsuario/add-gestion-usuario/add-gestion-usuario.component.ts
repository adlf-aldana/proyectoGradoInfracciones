import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, NgForm } from "@angular/forms";
import { AngularFireDatabase } from "angularfire2/database";
import { ServiciosService } from "src/app/services/servicios.service";
import { NotificationsService } from "angular2-notifications";
import { Cargos } from "src/app/models/cargoPersonal/cargos";
import * as firebase from "firebase/app";
import { GestionUsuario } from "src/app/models/gestionarUsuarios/gestion-usuario";
import { invalid } from "@angular/compiler/src/render3/view/util";
import { Router } from "@angular/router";
import * as crypto from "crypto-js";

import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-add-gestion-usuario",
  templateUrl: "./add-gestion-usuario.component.html",
  styleUrls: ["./add-gestion-usuario.component.css"]
})
export class AddGestionUsuarioComponent implements OnInit {
  registro: FormGroup;
  isShow = true;
  // isDisabled = false

  get nombreUsuario() {
    return this.registro.get("nombreUsuario");
  }

  get cargoUsuario() {
    return this.registro.get("cargoUsuario");
  }

  get password() {
    return this.registro.get("password");
  }

  get confirmPassword() {
    return this.registro.get("confirmPassword");
  }

  get correoUsuario() {
    return this.registro.get("correoUsuario");
  }

  // get f() {
  //   return this.registro.controls;
  // }

  // cargo: any;
  cargo: {
    $key: any;
    cargo: any;
  }[];
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    db: AngularFireDatabase,
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public authService: AuthService,
    public router: Router
  ) {
    db.list("cargosTransito")
      .snapshotChanges()
      .subscribe(item => {
        this.cargo = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          this.cargo.push({
            $key: x["$key"],
            cargo: crypto.AES.decrypt(
              x["cargo"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8)
          });
          // x["$key"] = element.key;
          // this.cargo.push(x as Cargos);
        });
      });
  }

  ngOnInit() {
    this.servicioServices.getUsuario();
    this.resetForm();

    this.registro = this.formBuilder.group(
      {
        $key: [],
        // nombreUsuario: ['', Validators.required],
        correoUsuario: ["", [Validators.required, Validators.email]],
        cargoUsuario: ["", Validators.required],
        ciUsuario: [""],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: confirmandoPassword("password", "confirmPassword")
      }
    );
  }

  buscarPersonal() {
    let i = 0;

    let ciPersonal: string = (document.getElementById("ci") as HTMLInputElement)
      .value;

    this.registro.patchValue({
      ciUsuario: ciPersonal
    });

    var ref = firebase.database().ref("personalTransito");

    // if (ref.orderByChild('ciPersonal').equalTo(ciPersonal).on("child_added", snap => {
    if (
      ref.orderByChild("ciPersonal").on("child_added", snap => {
        if (
          crypto.AES.decrypt(
            snap.val().ciPersonal,
            this.keySecret.trim()
          ).toString(crypto.enc.Utf8) === ciPersonal
        ) {
          this.isShow = !this.isShow;
          // this.isDisabled = true

          let nombrePersonal = crypto.AES.decrypt(
            snap.val().nombrePersonal,
            this.keySecret.trim()
          ).toString(crypto.enc.Utf8);
          document.getElementById("nombrePersonal").innerHTML = nombrePersonal;

          let apPaternoPersonal = crypto.AES.decrypt(
            snap.val().apPaternoPersonal,
            this.keySecret.trim()
          ).toString(crypto.enc.Utf8);
          document.getElementById(
            "apPaternoPersonal"
          ).innerHTML = apPaternoPersonal;

          let apMaternoPersonal = crypto.AES.decrypt(
            snap.val().apMaternoPersonal,
            this.keySecret.trim()
          ).toString(crypto.enc.Utf8);
          document.getElementById(
            "apMaternoPersonal"
          ).innerHTML = apMaternoPersonal;
          i = 1;
        }
      })
    ) {
      if (i == 0) {
        this.notificaciones.error("Error", "Carnet de Identidad no existente", {
          timeOut: 3000,
          showProgressBar: true
        });
      }
    }
  }

  addUsuario(servicioUsuario: NgForm) {
    if (servicioUsuario.valid) {
      if (servicioUsuario.value.$key == null) {
        this.authService
          .registerUser(
            this.servicioServices.seleccionarUsuario.correoUsuario,
            this.servicioServices.seleccionarUsuario.password
          )
          .then(success => {
            this.obteniendoDatosPersonal(
              0
            );
            this.servicioServices.insertUsuario(servicioUsuario.value);
            this.notificaciones.success(
              "Exitosamente",
              "Datos guardados correctamente",
              {
                timeOut: 3000,
                showProgressBar: true
              }
            );
            this.resetForm(servicioUsuario);
          })
          .catch(err => {
            this.notificaciones.error(
              "Error",
              "Ya hay un usuario usando ese correo electrónico",
              {
                timeOut: 3000,
                showProgressBar: true
              }
            );
          });
      } else {
        // this.obteniendoDatosPersonal(
        //   1,
        //   servicioUsuario.value.correoUsuario,
        //   servicioUsuario.value.ciUsuario,
        //   servicioUsuario.value.cargoUsuario
        // );
        var ref = firebase.database().ref("gestionUsuario");
          ref
            .orderByKey()
            .equalTo(servicioUsuario.value.$key)
            .on("child_added", snap => {
              let ciUsuario = snap.val().ciUsuario;
              let cargoUsuario = snap.val().cargoUsuario;
              let correoUsuario = snap.val().correoUsuario;

              this.obteniendoDatosPersonal(1,
                crypto.AES.decrypt(ciUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8),
                crypto.AES.decrypt(cargoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8),
                crypto.AES.decrypt(correoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8)
                );
            });
        this.servicioServices.updateUsuario(servicioUsuario.value);
        this.notificaciones.success(
          "Exitosamente",
          "Datos actualizados correctamente",
          {
            timeOut: 3000,
            showProgressBar: true
          }
        );
        this.resetForm(servicioUsuario);
      }

      // this.resetForm(servicioUsuario)
      // this.isDisabled = true
    } else {
      this.notificaciones.error("Error", "Datos no válidos", {
        timeOut: 3000,
        showProgressBar: true
      });
    }
  }

  resetForm(servicioUsuario?: NgForm) {
    if (servicioUsuario != null) {
      servicioUsuario.reset();
      this.servicioServices.seleccionarUsuario = new GestionUsuario();
      this.isShow = !this.isShow;
      (document.getElementById("ci") as HTMLInputElement).value = "";
      // this.isDisabled = true
    }
  }

  datosPersonal: {
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    cargo: any;
  };
  keySecret = "proyectoGradoUsfxTransito";
  public obteniendoDatosPersonal(
    i: number,
    ciUsuario?: string,
    cargoUsuario?: string,
    correoUsuario?: string
  ) {

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
                ).toString(crypto.enc.Utf8) == crypto.AES.decrypt(snap.val().ciUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8)
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
                  if (i == 0) idu = "Inserto usuario con C.I.: ";
                  else if (i == 1) idu = "Actualizo usuario con C.I.: ";
                  else if (i == 2) idu = "Elimino usuario C.I.: ";

                  if (i == 1) {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                      ciUsuario +
                      ", correo " +
                      correoUsuario +
                      ' y cargo ' +
                      cargoUsuario +
                      " por C.I." +
                      this.servicioServices.seleccionarUsuario.ciUsuario +
                      ", correo " +
                      this.servicioServices.seleccionarUsuario.correoUsuario +
                      ' y cargo ' +
                      this.servicioServices.seleccionarUsuario.cargoUsuario
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      // idu + ciUsuario + ", correo " + correoUsuario + cargoUsuario
                      idu +
                      this.servicioServices.seleccionarUsuario.ciUsuario +
                      ", correo " +
                      this.servicioServices.seleccionarUsuario.correoUsuario +
                      ' y cargo ' +
                      this.servicioServices.seleccionarUsuario.cargoUsuario
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

export function confirmandoPassword(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({
        mustMatch: true
      });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
