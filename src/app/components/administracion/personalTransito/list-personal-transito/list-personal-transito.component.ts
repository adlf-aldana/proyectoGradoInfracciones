import { Component, OnInit, ViewChild } from "@angular/core";
import { Personal } from "src/app/models/personalTransito/personal";
import { ServiciosService } from "src/app/services/servicios.service";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { NotificationsService } from "angular2-notifications";

import * as firebase from "firebase/app";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import * as crypto from "crypto-js";
@Component({
  selector: "app-list-personal-transito",
  templateUrl: "./list-personal-transito.component.html",
  styleUrls: ["./list-personal-transito.component.css"]
})
export class ListPersonalTransitoComponent implements OnInit {
  listaPersonal: Personal[];

  displayedColumns: string[] = [
    "nombrePersonal",
    "apPaternoPersonal",
    "apMaternoPersonal",
    "ciPersonal",
    "sexoPersonal",
    "celularPersonal",
    "fechaNacimientoPersonal",
    "direccionPersonal",
    "evento"
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notification: NotificationsService,
    public authService: AuthService,
    public router: Router
  ) {}

  dataSource = new MatTableDataSource(this.listaPersonal);

  personalTransito: {
    $key: any;
    nombrePersonal: any;
    apPaternoPersonal: any;
    apMaternoPersonal: any;
    ciPersonal: any;
    sexoPersonal: any;
    fechaNacimientoPersonal: any;
    celularPersonal: any;
    direccionPersonal: any;
  }[];

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "";

    this.servicioServices
      .getPersonal()
      .snapshotChanges()
      .subscribe(item => {
        this.personalTransito = [];
        this.listaPersonal = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;

          // console.log(x["$key"]);

          this.personalTransito.push({
            $key: x["$key"],

            nombrePersonal: crypto.AES.decrypt(
              x["nombrePersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            apPaternoPersonal: crypto.AES.decrypt(
              x["apPaternoPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            apMaternoPersonal: crypto.AES.decrypt(
              x["apMaternoPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            ciPersonal: crypto.AES.decrypt(
              x["ciPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            sexoPersonal: crypto.AES.decrypt(
              x["sexoPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            fechaNacimientoPersonal: crypto.AES.decrypt(
              x["fechaNacimientoPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            celularPersonal: crypto.AES.decrypt(
              x["celularPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8),

            direccionPersonal: crypto.AES.decrypt(
              x["direccionPersonal"],
              this.keySecret.trim()
            ).toString(crypto.enc.Utf8)
          });

          this.dataSource = new MatTableDataSource(this.personalTransito);
          this.dataSource.paginator = this.paginator;
        });
      });
  }
  // ngOnInit() {
  //   this.servicioServices.getPersonal()
  //   .snapshotChanges()
  //   .subscribe(item=>{
  //     this.listaPersonal=[];
  //     item.forEach(element=>{
  //       let x= element.payload.toJSON();
  //       x["$key"]=element.key;
  //       this.listaPersonal.push(x as Personal);
  //       this.dataSource = new MatTableDataSource(this.listaPersonal);
  //       this.dataSource.paginator = this.paginator;
  //     })
  //   })
  // }

  keySecret = "proyectoGradoUsfxTransito";
  public obteniendoDatosPersonal(i: number, ciPersonal?: string) {
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
                        ciPersonal +
                        " a " +
                        this.servicioServices.seleccionarPersonal.ciPersonal
                    );
                  } else {
                    this.servicioServices.insertBitacora(
                      this.datosPersonal.nombre,
                      this.datosPersonal.apPaterno,
                      this.datosPersonal.apMaterno,
                      this.datosPersonal.cedula,
                      fechaInfraccion,
                      idu + ciPersonal
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(personalTransito: Personal) {
    this.servicioServices.seleccionarPersonal = Object.assign(
      {},
      personalTransito
    );
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
      var ref = firebase.database().ref("personalTransito");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          let ci = snap.val().ciPersonal;

          this.obteniendoDatosPersonal(2, ci);
        });
      // var ref = firebase.database().ref("personalTransito");

      // ref
      //   .orderByKey()
      //   .equalTo($key)
      //   .on("child_added", snap => {
      //     let date = new Date();
      //     let fechaInfraccion;
      //     if (date.getMonth() + 1 < 10)
      //       fechaInfraccion =
      //         date.getDate() +
      //         "/0" +
      //         (date.getMonth() + 1) +
      //         "/" +
      //         date.getFullYear() +
      //         " " +
      //         date.getHours() +
      //         ":" +
      //         date.getMinutes() +
      //         ":" +
      //         date.getSeconds();
      //     else
      //       fechaInfraccion =
      //         date.getDate() +
      //         "/" +
      //         (date.getMonth() + 1) +
      //         "/" +
      //         date.getFullYear() +
      //         " " +
      //         date.getHours() +
      //         ":" +
      //         date.getMinutes() +
      //         ":" +
      //         date.getSeconds();

      //     // console.log(crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8))

      //     this.servicioServices.insertBitacora(
      //       this.datosPersonal.nombre,
      //       this.datosPersonal.apPaterno,
      //       this.datosPersonal.apMaterno,
      //       this.datosPersonal.cedula,
      //       fechaInfraccion,
      //       "Elimino personal con C.I. : " +
      //         crypto.AES.decrypt(
      //           snap.val().cargo,
      //           this.keySecret.trim()
      //         ).toString(crypto.enc.Utf8)
      //     );
      //   });

      this.servicioServices.deletePersonal($key);
      this.notification.success(
        "¡Correcto!",
        "El item fue eliminado correctamente",
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          show: true
        }
      );
    }
  }
}
