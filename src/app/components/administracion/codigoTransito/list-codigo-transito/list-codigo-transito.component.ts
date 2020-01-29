import { Component, OnInit, ViewChild } from "@angular/core";
import { ServiciosService } from "src/app/services/servicios.service";
import { CodigoTransito } from "src/app/models/codigoTransito/codigo-transito";
import { NotificationsService } from "angular2-notifications";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import * as crypto from "crypto-js";
import * as firebase from "firebase/app";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-codigo-transito",
  templateUrl: "./list-codigo-transito.component.html",
  styleUrls: ["./list-codigo-transito.component.css"]
})
export class ListCodigoTransitoComponent implements OnInit {
  listaCodigos: CodigoTransito[];

  displayedColumns: string[] = ["articulo", "numero", "descripcion", "evento"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notificacion: NotificationsService,
    public authService: AuthService,
    public router: Router
  ) {}

  dataSource = new MatTableDataSource(this.listaCodigos);

  ngOnInit() {
    this.servicioServices
      .getCodigoTransito()
      .snapshotChanges()
      .subscribe(item => {
        this.listaCodigos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.listaCodigos.push({
            $key: x["$key"],
            articulo: crypto.AES.decrypt(
              x["articulo"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),
            numero: crypto.AES.decrypt(
              x["numero"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),
            descripcion: crypto.AES.decrypt(
              x["descripcion"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8)
          });
          // this.listaCodigos.push(x as CodigoTransito)
          this.dataSource = new MatTableDataSource(this.listaCodigos);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(codigoTransito: CodigoTransito) {
    this.servicioServices.seleccionarCodigoTransito = Object.assign(
      {},
      codigoTransito
    );
  }

  onDelete($key: string) {
    if (confirm("¿Esta seguro de querer eliminarlo?")) {
      var ref = firebase.database().ref("codigosTransito");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          
          let art = crypto.AES.decrypt(snap.val().articulo, this.keySecret.trim()).toString(crypto.enc.Utf8);
          let num = crypto.AES.decrypt(snap.val().numero, this.keySecret.trim()).toString(crypto.enc.Utf8);
          let descripcion = crypto.AES.decrypt(snap.val().descripcion, this.keySecret.trim()).toString(crypto.enc.Utf8);
          
          this.obteniendoDatosPersonal(2, art, num, descripcion);
        });
      this.servicioServices.deleteCodigoTransito($key);
      this.notificacion.success(
        "Exitosamente",
        "Item eliminado correctamente",
        {
          timeOut: 3000,
          showProgressBar: true
        }
      );
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
  public obteniendoDatosPersonal(i: number, art?: string, num?: string, desc?:string) {
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
                  if (i == 0) idu = "Inserto articulo de tránsito: ";
                  else if (i == 1) idu = "Actualizo código: ";
                  else if (i == 2) idu = "Elimino artículo de tránsito: ";

                  if (i == 1) {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        art +
                        " a " +
                        this.servicioServices.seleccionarCodigoTransito.articulo
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        art +
                        " Número " +
                        num +
                        " Descripción: " +
                        desc
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
