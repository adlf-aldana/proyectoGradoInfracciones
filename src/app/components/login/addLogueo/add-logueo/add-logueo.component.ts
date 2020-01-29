import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import * as firebase from "firebase/app";
import * as crypto from 'crypto-js'

@Component({
  selector: "app-add-logueo",
  templateUrl: "./add-logueo.component.html",
  styleUrls: ["./add-logueo.component.css"]
})
export class AddLogueoComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    public notificaciones: NotificationsService
  ) {}

  ngOnInit() {}
  
  keySecret = "proyectoGradoUsfxTransito";
  onSubmitLogin() {
    // this.authService.loginEmail(this.email, this.password)
    this.authService
      .loginEmail("x@gmail.com", "1111111")
      .then(res => {
        var ref = firebase.database().ref("gestionUsuarios");
        // ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
        // ref.orderByChild('correoUsuario').equalTo(this.email).on("child_added", snap => {
        ref
          .orderByChild("correoUsuario")
          .on("child_added", snap => {

            if (crypto.AES.decrypt(snap.val().correoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8) === "x@gmail.com") {
              if (crypto.AES.decrypt(snap.val().cargoUsuario,this.keySecret.trim()).toString(crypto.enc.Utf8) === "Administrador") {
                // console.log('es administrador');
                this.router.navigate(["/administrador"]);
              } else {
                alert(
                  "Los agentes policiales solo puede ingresar por la aplicación movil"
                );
                // console.log('no es administrador');
                // this.router.navigate(['/registro']);
              }
            }
          });
      })
      .catch(err => {
        this.notificaciones.error("Error", "Usuario o contraseña incorrectas", {
          position: ["top", "left"],
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          lastOnBottom: true,
          animate: "fromLeft"
        });
      });
  }
}
