import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import * as firebase from "firebase/app";
import * as crypto from "crypto-js";

@Component({
  selector: "app-cabecera",
  templateUrl: "./cabecera.component.html",
  styleUrls: ["./cabecera.component.css"]
})
export class CabeceraComponent implements OnInit {
  public isLogin: boolean;
  public isAdmin: boolean = false;
  public isPolicia: any = null;

  public nombreUsuario: string;
  public emailUsuario: string;

  constructor(public authService: AuthService) {}

  keySecret = "proyectoGradoUsfxTransito";
  ngOnInit() {
    this.onCheckUser();

    this.authService.getAuth().subscribe(auth => {
      // console.log(auth);

      if (auth) {
        // console.log("isAdmin "+this.isAdmin);
        // this.isLogin=true;

        // this.nombreUsuario=auth.displayName;
        this.emailUsuario = auth.email;
        
        var ref = firebase.database().ref("gestionUsuarios");
        // ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
          // ref.orderByChild('correoUsuario').equalTo(this.emailUsuario).on("child_added", snap => {
            ref.orderByChild("correoUsuario").on("child_added", snap => {
          // console.log(snap.val().cargoUsuario);
          if (
            crypto.AES.decrypt(
              snap.val().correoUsuario,
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8) === this.emailUsuario
          ) {
            if (crypto.AES.decrypt(snap.val().cargoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8) === "Administrador") {
              this.isAdmin = true;
            } else {
              // console.log('no es administrador');
              this.isPolicia = true;
            }
          }
        });
      }
    });
  }

  onCheckUser(): void {
    if (this.authService.getAuth() == null) {
      this.isLogin == false;
    } else {
      this.isLogin == true;
    }
  }
  onClickLogout() {
    this.authService.logOut();
  }
}
