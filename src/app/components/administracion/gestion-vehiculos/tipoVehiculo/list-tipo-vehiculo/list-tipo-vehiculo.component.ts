import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import * as firebase from 'firebase/app'
import * as crypto from 'crypto-js'
import {AuthService} from '../../../../../services/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-list-tipo-vehiculo',
  templateUrl: './list-tipo-vehiculo.component.html',
  styleUrls: ['./list-tipo-vehiculo.component.css']
})
export class ListTipoVehiculoComponent implements OnInit {

  listaTipoVehiculos: TipoVehiculo[];

  displayedColumns: string[] = ['tipo','evento']
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices:ServiciosService,
    public notificaciones: NotificationsService,
    public authService: AuthService,
    public router: Router
    ) { }

    dataSource = new MatTableDataSource(this.listaTipoVehiculos)

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaTipoVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaTipoVehiculos.push({
          $key: x["$key"],
          nombreTipoVehiculo: crypto.AES.decrypt(x["nombreTipoVehiculo"], this.keySecret.trim()).toString(crypto.enc.Utf8)
        })
        // this.listaTipoVehiculos.push(x as TipoVehiculo);
        this.dataSource = new MatTableDataSource(this.listaTipoVehiculos)
        this.dataSource.paginator = this.paginator
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(sv: TipoVehiculo){
    this.servicioServices.seleccionarTipoVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
      var ref = firebase.database().ref("tipoVehiculos");
      ref
        .orderByKey()
        .equalTo($key)
        .on("child_added", snap => {
          // cargo = crypto.AES.decrypt(snap.val().cargo, this.keySecret.trim()).toString(crypto.enc.Utf8)
          let cargo = crypto.AES.decrypt(snap.val().nombreTipoVehiculo,this.keySecret.trim()).toString(crypto.enc.Utf8)

          this.obteniendoDatosPersonal(2, cargo);
        });
    this.servicioServices.deleteTipoVehiculo($key);
    this.notificaciones.success('Exitosamente','Tipo de servicio eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
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
                  if (i == 0) idu = "Inserto tipo de vehiculo: ";
                  else if (i == 1) idu = "Actualizo tipo de vehiculo: ";
                  else if (i == 2) idu = "Elimino tipo de vehiculo: ";

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
                        this.servicioServices.seleccionarTipoVehiculo.nombreTipoVehiculo
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

}