import { Component, OnInit } from "@angular/core";
import { ServiciosService } from "src/app/services/servicios.service";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Personal } from "src/app/models/personalTransito/personal";
import { NotificationsService } from "angular2-notifications";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import * as firebase from "firebase/app";
import { AngularFireDatabase } from "angularfire2/database";
import { Cargos } from "src/app/models/cargoPersonal/cargos";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import * as crypto from "crypto-js";

@Component({
  selector: "app-add-personal-transito",
  templateUrl: "./add-personal-transito.component.html",
  styleUrls: ["./add-personal-transito.component.css"]
})
export class AddPersonalTransitoComponent implements OnInit {
  personalTransito: FormGroup;

  get nombrePersonal() {
    return this.personalTransito.get("nombrePersonal");
  }
  get apPaternoPersonal() {
    return this.personalTransito.get("apPaternoPersonal");
  }
  get apMaternoPersonal() {
    return this.personalTransito.get("apMaternoPersonal");
  }
  get ciPersonal() {
    return this.personalTransito.get("ciPersonal");
  }
  get cargoPersonal() {
    return this.personalTransito.get("cargoPersonal");
  }
  get sexoPersonal() {
    return this.personalTransito.get("sexoPersonal");
  }
  get celularPersonal() {
    return this.personalTransito.get("celularPersonal");
  }
  get fechaNacimientoPersonal() {
    return this.personalTransito.get("fechaNacimientoPersonal");
  }
  get direccionPersonal() {
    return this.personalTransito.get("direccionPersonal");
  }

  num: any = /^(?:\+|-)?\d+$/;
  cargo: any;
  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    db: AngularFireDatabase,
    public authService: AuthService,
    public router: Router
  ) {
    this.personalTransito = this.builder.group({
      $key: [],
      nombrePersonal: ["", Validators.required],
      apPaternoPersonal: ["", Validators.required],
      apMaternoPersonal: ["", Validators.required],
      ciPersonal: [
        "",
        [Validators.required, Validators.maxLength(11), Validators.minLength(7)]
      ],
      sexoPersonal: ["", Validators.required],
      // celularPersonal: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(this.num)]],
      celularPersonal: [
        "",
        [
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(this.num)
        ]
      ],
      fechaNacimientoPersonal: ["", Validators.required],
      direccionPersonal: []
    });

    db.list("cargosTransito")
      .snapshotChanges()
      .subscribe(item => {
        this.cargo = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.cargo.push(x as Cargos);
        });
      });
  }

  datosPersonal: {
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    cargo: any;
  };

  keySecret = "proyectoGradoUsfxTransito";
  public obteniendoDatosPersonal(i: number,
    ciPersonal?: string,
    nombrePersonal?: string,
    apPaternoPersonal?: string,
    apMaternoPersonal?: string,
    sexoPersonal?: string,
    celularPersonal?: string,
    fechaNacimientoPersonal?: string,
    direccionPersonal?: string) {
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

            // console.log(snap.val().ciUsuario);
            ref2.orderByChild("ciPersonal").on("child_added", snap2 => {
              // console.log(crypto.AES.decrypt(snap2.val().ciPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8));
              if (
                crypto.AES.decrypt(
                  snap2.val().ciPersonal,
                  this.keySecret.trim()
                ).toString(crypto.enc.Utf8) === crypto.AES.decrypt(snap.val().ciUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8)
              ) {
                console.log('lol');
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
                  if (i == 0) idu = "Inserto nuevo personal con C.I.: ";
                  else if (i == 1) idu = "Actualizo personal con C.I.: ";
                  else if (i == 2) idu = "Elimino personal con C.I.: ";

                  if (i == 1) {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                      ' C.I. ' + ciPersonal +
                      ' Nombre: ' + nombrePersonal +
                      ' Apellido Paterno: ' + apPaternoPersonal +
                      ' Apellido Materno: ' + apMaternoPersonal +
                      ' Sexo: ' + sexoPersonal +
                      ' Celular: ' + celularPersonal +
                      ' Fecha Nacimiento: ' + fechaNacimientoPersonal +
                      ' Direccion: ' + direccionPersonal +
                      " A " +
                      ' C.I. ' + this.servicioServices.seleccionarPersonal.ciPersonal +
                      ' Nombre: ' + this.servicioServices.seleccionarPersonal.nombrePersonal +
                      ' Apellido Paterno: ' + this.servicioServices.seleccionarPersonal.apPaternoPersonal +
                      ' Apellido Materno: ' + this.servicioServices.seleccionarPersonal.apMaternoPersonal +
                      ' Sexo: ' + this.servicioServices.seleccionarPersonal.sexoPersonal +
                      ' Celular: ' + this.servicioServices.seleccionarPersonal.celularPersonal +
                      ' Fecha de Nacimiento: ' + this.servicioServices.seleccionarPersonal.fechaNacimientoPersonal +
                      ' Direccion: ' + this.servicioServices.seleccionarPersonal.direccionPersonal
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.servicioServices.seleccionarPersonal.ciPersonal +
                      ' Nombre: ' + this.servicioServices.seleccionarPersonal.nombrePersonal +
                      ' Apellido Paterno: ' + this.servicioServices.seleccionarPersonal.apPaternoPersonal +
                      ' Apellido Materno: ' + this.servicioServices.seleccionarPersonal.apMaternoPersonal +
                      ' Sexo: ' + this.servicioServices.seleccionarPersonal.sexoPersonal +
                      ' Celular: ' + this.servicioServices.seleccionarPersonal.celularPersonal +
                      ' Fecha de Nacimiento: ' + this.servicioServices.seleccionarPersonal.fechaNacimientoPersonal +
                      ' Direccion: ' + this.servicioServices.seleccionarPersonal.direccionPersonal
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
    this.servicioServices.getPersonal();
    this.resetForm();
  }

  addPersonalTransito(servicioPersonalTransito: NgForm) {
    if (servicioPersonalTransito.valid) {
      var ref = firebase.database().ref("personalTransito");
      var existe = false;
      // Comprobando si existe o no el cargo
      ref
        .orderByChild("ciPersonal")
        .equalTo(this.servicioServices.seleccionarPersonal.ciPersonal)
        .on("child_added", snap => {
          existe = true;
        });
      if (existe) {
        this.notificaciones.error(
          "Error",
          "Ya existe un personal con el C.I.",
          {
            timeOut: 3000,
            showProgressBar: true
          }
        );
      } else {
        if (servicioPersonalTransito.value.$key == null) {
          this.obteniendoDatosPersonal(0);
          this.servicioServices.insertPersonal(servicioPersonalTransito.value);
          this.notificaciones.success(
            "Exitosamente",
            "Datos guardados correctamente",
            {
              timeOut: 3000,
              showProgressBar: true
            }
          );
        } else {
          var ref = firebase.database().ref("personalTransito");
          ref
            .orderByKey()
            .equalTo(servicioPersonalTransito.value.$key)
            .on("child_added", snap => {
              let nombrePersonal = crypto.AES.decrypt(snap.val().nombrePersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let apPaternoPersonal = crypto.AES.decrypt(snap.val().apPaternoPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let apMaternoPersonal = crypto.AES.decrypt(snap.val().apMaternoPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let ci = crypto.AES.decrypt(snap.val().ciPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let sexoPersonal = crypto.AES.decrypt(snap.val().sexoPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let celularPersonal = crypto.AES.decrypt(snap.val().celularPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let fechaNacimientoPersonal = crypto.AES.decrypt(snap.val().fechaNacimientoPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              let direccionPersonal = crypto.AES.decrypt(snap.val().direccionPersonal, this.keySecret.trim()).toString(crypto.enc.Utf8);
              this.obteniendoDatosPersonal(1,
                ci,
                nombrePersonal,
                apPaternoPersonal,
                apMaternoPersonal,
                sexoPersonal,
                celularPersonal,
                fechaNacimientoPersonal,
                direccionPersonal);
            });
          this.servicioServices.updatePersonal(servicioPersonalTransito.value);
          this.notificaciones.success(
            "Exitosamente",
            "Datos actualizados correctamente",
            {
              timeOut: 3000,
              showProgressBar: true
            }
          );
        }
        this.resetForm(servicioPersonalTransito);
      }
    } else {
      console.log("Error no valido");
    }
  }

  resetForm(servicioPersonalTransito?: NgForm) {
    if (servicioPersonalTransito != null) {
      servicioPersonalTransito.reset();
      this.servicioServices.seleccionarPersonal = new Personal();
    }
  }
}
