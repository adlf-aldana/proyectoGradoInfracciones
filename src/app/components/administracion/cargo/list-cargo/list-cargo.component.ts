import { Component, OnInit, ViewChild } from "@angular/core";
import { Cargos } from "src/app/models/cargoPersonal/cargos";
import { ServiciosService } from "src/app/services/servicios.service";
import { NotificationsService } from "angular2-notifications";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { AngularFireDatabase } from "angularfire2/database";
import * as crypto from "crypto-js";
import * as firebase from "firebase/app";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-cargo",
  templateUrl: "./list-cargo.component.html",
  styleUrls: ["./list-cargo.component.css"]
})
export class ListCargoComponent implements OnInit {
  listaCargos: Cargos[];
  listaCargos2: Cargos[];

  displayedColumns: string[] = ["cargo", "evento"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public authService: AuthService,
    public router: Router
  ) {}

  dataSource = new MatTableDataSource(this.listaCargos);
  keySecret = "proyectoGradoUsfxTransito";

  carguito: {
    $key: any;
    cargo: any;
  }[];

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = "";
    this.servicioServices
      .getCargo()
      .snapshotChanges()
      .subscribe(item => {
        this.carguito = [];
        this.listaCargos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;

          // console.log(x["$key"]);
          // console.log(x["cargo"]);

          this.carguito.push({
            $key: x["$key"],
            cargo: crypto.AES.decrypt(
              x["cargo"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8)
          });

          // this.listaCargos.push(x as Cargos)

          // this.dataSource = new MatTableDataSource(this.listaCargos)
          this.dataSource = new MatTableDataSource(this.carguito);
          this.dataSource.paginator = this.paginator;
        });
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(cargo: Cargos) {
    this.servicioServices.seleccionarCargo = Object.assign({}, cargo);
  }

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

  datosPersonal: {
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    cargo: any;
  };

  onDelete($key: string) {
    if (confirm("¿Esta seguro de querer eliminarlo?")) {
      var ref = firebase.database().ref("cargosTransito");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          let cargo = snap.val().cargo;

          this.obteniendoDatosPersonal(2, crypto.AES.decrypt(cargo, this.keySecret.trim()).toString(crypto.enc.Utf8));
        });
      this.servicioServices.deleteCargos($key);
      this.notificaciones.success(
        "Exitosamente",
        "Cargo eliminado correctamente",
        {
          timeOut: 3000,
          showProgressBar: true
        }
      );
    }
  }
}
