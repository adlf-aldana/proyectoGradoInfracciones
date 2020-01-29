import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as firebase from "firebase/app";
import { AngularFireDatabase } from "angularfire2/database";
import { Cargos } from "src/app/models/cargoPersonal/cargos";
import { ServiciosService } from "src/app/services/servicios.service";
import { NotificationsService } from "angular2-notifications";
import { GestionUsuario } from "src/app/models/gestionarUsuarios/gestion-usuario";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import * as crypto from 'crypto-js'
import { AuthService } from '../../../../services/auth.service';
import {Router} from '@angular/router'

@Component({
  selector: "app-list-gestion-usuario",
  templateUrl: "./list-gestion-usuario.component.html",
  styleUrls: ["./list-gestion-usuario.component.css"]
})
export class ListGestionUsuarioComponent implements OnInit {
  listaUsuario: GestionUsuario[];

  displayedColumns: string[] = [
    "ciUsuario",
    // 'nombreUsuario',
    "cargoUsuario",
    "correoUsuario",
    "evento"
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notification: NotificationsService,
    public authService: AuthService,
    public router: Router
  ) { }

  dataSource = new MatTableDataSource(this.listaUsuario);

  ngOnInit() {
    this.servicioServices
      .getUsuario()
      .snapshotChanges()
      .subscribe(item => {
        this.listaUsuario = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.listaUsuario.push({
            $key: x["$key"],
            ciUsuario: crypto.AES.decrypt(x["ciUsuario"], this.keySecret.trim()).toString(crypto.enc.Utf8),
            nombreUsuario: x["nombreUsuario"],
            correoUsuario: crypto.AES.decrypt(x["correoUsuario"], this.keySecret.trim()).toString(crypto.enc.Utf8),
            cargoUsuario: crypto.AES.decrypt(x["cargoUsuario"], this.keySecret.trim()).toString(crypto.enc.Utf8),
            password: x["password"],
            confirmPassword: x["password"]
          })
          // x["$key"]=element.key;
          // this.listaUsuario.push(x as GestionUsuario);
          this.dataSource = new MatTableDataSource(this.listaUsuario);
          this.dataSource.paginator = this.paginator;
        });
      });

    // this.servicioServices.getUsuario()
    // .snapshotChanges()
    // .subscribe(item=>{
    //   this.listaUsuario=[];
    //   item.forEach(element=>{
    //     let x= element.payload.toJSON();
    //     x["$key"]=element.key;
    //     this.listaUsuario.push(x as GestionUsuario);
    //     this.dataSource = new MatTableDataSource(this.listaUsuario);
    //     this.dataSource.paginator = this.paginator;
    //   })
    // })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(usuario: GestionUsuario) {
    console.log(usuario);

    this.servicioServices.seleccionarUsuario = Object.assign({}, usuario);
  }

  onDelete($key: string) {
    console.log($key);

    if (confirm("¿Esta seguro de querer eliminarlo?")) {
      var ref = firebase.database().ref("gestionUsuarios");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          let ciUsuario = snap.val().ciUsuario;
          let cargoUsuario = snap.val().cargoUsuario;
          let correoUsuario = snap.val().correoUsuario;


          this.obteniendoDatosPersonal(2, crypto.AES.decrypt(ciUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8),
          crypto.AES.decrypt(cargoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8),
          crypto.AES.decrypt(correoUsuario, this.keySecret.trim()).toString(crypto.enc.Utf8)
          );
        });
      this.servicioServices.deleteUsuario($key);
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

  datosPersonal: {
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    cargo: any;
  };
  keySecret = "proyectoGradoUsfxTransito";
  public obteniendoDatosPersonal(i: number, ciUsuario?: string, cargoUsuario?: string, correoUsuario?: string) {
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
                      ciUsuario +
                      ", correo " +
                      correoUsuario +
                      ' y cargo ' +
                      cargoUsuario
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