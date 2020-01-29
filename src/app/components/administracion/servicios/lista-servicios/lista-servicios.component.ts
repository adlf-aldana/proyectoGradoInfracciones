import { Component, OnInit, ViewContainerRef, ViewChild } from "@angular/core";
import { ServiciosService } from "src/app/services/servicios.service";
import { Tipo } from "src/app/models/tipoServicioVehiculo/tipo";
import { NotificationsService } from "angular2-notifications";
import { MatTableDataSource, MatPaginator } from "@angular/material";
// import { NotificationsService } from 'angular2-notifications';
import * as firebase from "firebase/app";
import * as crypto from "crypto-js";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-lista-servicios",
  templateUrl: "./lista-servicios.component.html",
  styleUrls: ["./lista-servicios.component.css"]
})
export class ListaServiciosComponent implements OnInit {
  listaServicios: Tipo[];

  displayedColumns: string[] = ["nombreTipoServicio", "evento"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public serviciosServices: ServiciosService,
    public notificaciones: NotificationsService,
    public router: Router,
    public authService: AuthService
  ) {}

  dataSource = new MatTableDataSource(this.listaServicios);

  ngOnInit() {
    this.serviciosServices
      .getServiciosVehiculares()
      .snapshotChanges()
      .subscribe(item => {
        this.listaServicios = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.listaServicios.push({
            $key: x["$key"],
            nombreTipoServicio: crypto.AES.decrypt(
              x["nombreTipoServicio"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8)
          });
          // this.listaServicios.push(x as Tipo);
          this.dataSource = new MatTableDataSource(this.listaServicios);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(sv: Tipo) {
    this.serviciosServices.seleccionarServicioVehicular = Object.assign({}, sv);
  }

  onDelete($key: string) {
    if (confirm("¿Esta seguro de querer eliminarlo?")) {
      var ref = firebase.database().ref("serviciosVehiculares");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          let servicio = crypto.AES.decrypt(snap.val().nombreTipoServicio, this.keySecret.trim()).toString(crypto.enc.Utf8)
          

          this.obteniendoDatosPersonal(2, servicio);
        });
      // this.serviciosServices.deleteTipoServicioVehicular($key);
      this.notificaciones.success(
        "¡Correcto!",
        "El item fue eliminado correctamente",
        {
          position: ["bottom", "right"],
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          show: true
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
  public obteniendoDatosPersonal(i: number, servicio?: string) {
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
                  if (i == 0) idu = "Inserto servicio: ";
                  else if (i == 1) idu = "Actualizo servicio: ";
                  else if (i == 2) idu = "Elimino servicio: ";

                  if (i == 1) {
                    this.serviciosServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        servicio +
                        " a " +
                        this.serviciosServices.seleccionarServicioVehicular
                          .nombreTipoServicio
                    );
                  } else {
                    this.serviciosServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu +
                        servicio
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
