import { Component, OnInit, ViewChild } from "@angular/core";
import { ServiciosService } from "src/app/services/servicios.service";
import * as crypto from "crypto-js";
import * as firebase from "firebase/app";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { MatTableDataSource, MatPaginator } from "@angular/material";

@Component({
  selector: "app-list-bitacora",
  templateUrl: "./list-bitacora.component.html",
  styleUrls: ["./list-bitacora.component.css"]
})
export class ListBitacoraComponent implements OnInit {
  listBitacora: {
    $key: any;
    fechaHora: any;
    nombre: any;
    apPaterno: any;
    apMaterno: any;
    cedula: any;
    evento: any;
  }[];

  displayedColumns: string[] = ["fechaHora", "nombre", "apPaterno", "apMaterno", "cedula", "evento"];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public authService: AuthService,
    public router: Router
    ) {}

    keySecret = "proyectoGradoUsfxTransito";
    
    
    dataSource = new MatTableDataSource(this.listBitacora);
    
  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = "";
    this.servicioServices
      .getBitacora()
      .snapshotChanges()
      .subscribe(item => {
        this.listBitacora = [];
        // this.listaCargos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          
          this.listBitacora.push({
            $key: x["$key"],
            fechaHora: x["fechaHora"],
            nombre: crypto.AES.decrypt(x["nombre"],this.keySecret.trim()).toString(crypto.enc.Utf8),
            apPaterno: crypto.AES.decrypt(x["apPaterno"],this.keySecret.trim()).toString(crypto.enc.Utf8),
            apMaterno: crypto.AES.decrypt(x["apMaterno"],this.keySecret.trim()).toString(crypto.enc.Utf8),
            cedula: crypto.AES.decrypt(x["cedula"],this.keySecret.trim()).toString(crypto.enc.Utf8),
            evento: crypto.AES.decrypt(x["evento"],this.keySecret.trim()).toString(crypto.enc.Utf8),
          });

          // this.listaCargos.push(x as Cargos)

          // this.dataSource = new MatTableDataSource(this.listaCargos)
          this.dataSource = new MatTableDataSource(this.listBitacora);
          this.dataSource.paginator = this.paginator;
        });
      });
  }
}
