import { Component, OnInit } from "@angular/core";
import { CodigoTransito } from "src/app/models/codigoTransito/codigo-transito";
import { NgForm, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ServiciosService } from "src/app/services/servicios.service";
import { NotificationsService } from "angular2-notifications";
import {AuthService} from '../../../../services/auth.service'
import * as firebase from 'firebase/app'
import {Router} from '@angular/router'
import * as crypto from 'crypto-js'
@Component({
  selector: "app-add-codigo-transito",
  templateUrl: "./add-codigo-transito.component.html",
  styleUrls: ["./add-codigo-transito.component.css"]
})
export class AddCodigoTransitoComponent implements OnInit {
  codigoTransito: FormGroup;

  get articulo() {
    return this.codigoTransito.get("articulo");
  }
  get numero() {
    return this.codigoTransito.get("numero");
  }
  get descripcion() {
    return this.codigoTransito.get("descripcion");
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.codigoTransito = this.builder.group({
      $key: [],
      articulo: ["", Validators.required],
      numero: ["", Validators.required],
      descripcion: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.servicioServices.getCodigoTransito();
    this.resetForm();
  }

  addCodigoTransito(servicioCodigoTransito: NgForm) {
    if (servicioCodigoTransito.valid) {
      if (servicioCodigoTransito.value.$key == null) {
        this.obteniendoDatosPersonal(0)
        this.servicioServices.insertCodigosTransito(
          servicioCodigoTransito.value
        );
        this.notificaciones.success(
          "Exitosamente",
          "Item guardado correctamente",
          {
            timeOut: 3000,
            showProgressBar: true
          }
        );
      } else {
        var ref = firebase.database().ref("codigosTransito");
          ref
            .orderByKey()
            .equalTo(servicioCodigoTransito.value.$key)
            .on("child_added", snap => {
              let codigo = snap.val().articulo;
              let numero = snap.val().numero;
              let descripcion = snap.val().descripcion;
    
              this.obteniendoDatosPersonal(1, 
                crypto.AES.decrypt(codigo, this.keySecret.trim()).toString(crypto.enc.Utf8),
                crypto.AES.decrypt(numero, this.keySecret.trim()).toString(crypto.enc.Utf8),
                crypto.AES.decrypt(descripcion, this.keySecret.trim()).toString(crypto.enc.Utf8)
                );
            });
        this.servicioServices.updateCodigosTransito(
          servicioCodigoTransito.value
        );
        this.notificaciones.success(
          "Exitosamente",
          "Item actualizado correctamente",
          {
            timeOut: 3000,
            showProgressBar: true
          }
        );
      }
      this.resetForm(servicioCodigoTransito);
    }
  }

  resetForm(servicioCodigoTransito?: NgForm) {
    if (servicioCodigoTransito != null) {
      servicioCodigoTransito.reset();
      this.servicioServices.seleccionarCodigoTransito = new CodigoTransito();
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
  public obteniendoDatosPersonal(i: number, codigo?: string, numero?: string, descripcion?: string) {
    
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
                ).toString(crypto.enc.Utf8) ===
                crypto.AES.decrypt(
                  snap.val().ciUsuario,
                  this.keySecret.trim()
                ).toString(crypto.enc.Utf8)
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
                  if (i == 0) idu = "Inserto codigo de tránsito: ";
                  else if (i == 1) idu = "Actualizo código: ";
                  else if (i == 2) idu = "Elimino código de tránsito: ";

                  if (i == 1) {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        codigo + ' Artículo: ' + numero + ' Descripción: ' + descripcion +
                        " A Código: " +
                        this.servicioServices.seleccionarCodigoTransito.articulo +
                        ' Número: ' +
                        this.servicioServices.seleccionarCodigoTransito.numero +
                        ' Descripción: ' +
                        this.servicioServices.seleccionarCodigoTransito.descripcion
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + this.servicioServices.seleccionarCodigoTransito.articulo +
                      ' Artículo: ' + this.servicioServices.seleccionarCodigoTransito.numero +
                      ' Descripción: ' + this.servicioServices.seleccionarCodigoTransito.descripcion
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
