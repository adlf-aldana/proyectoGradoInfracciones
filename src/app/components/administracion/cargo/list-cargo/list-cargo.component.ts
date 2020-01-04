import { Component, OnInit, ViewChild } from '@angular/core';
import { Cargos } from 'src/app/models/cargoPersonal/cargos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import * as crypto from 'crypto-js';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-list-cargo',
  templateUrl: './list-cargo.component.html',
  styleUrls: ['./list-cargo.component.css']
})
export class ListCargoComponent implements OnInit {
  listaCargos: Cargos[];
  listaCargos2: Cargos[];

  displayedColumns: string[] = ['cargo', 'evento'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService
  ) { }

  dataSource = new MatTableDataSource(this.listaCargos)
  keySecret = "proyectoGradoUsfxTransito"
  
  carguito : {
    $key: any;
    cargo: any;
  }[]

  ngOnInit() {

    this.paginator._intl.itemsPerPageLabel = '';

    this.servicioServices.getCargo()
      .snapshotChanges()
      .subscribe(item => {
        this.carguito = [];
        this.listaCargos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;

          // console.log(x["$key"]);
          // console.log(x["cargo"]);
    
        this.carguito.push({$key: x["$key"], cargo: crypto.AES.decrypt(x["cargo"], this.keySecret.trim()).toString(crypto.enc.Utf8)})

          // this.listaCargos.push(x as Cargos)
          
          
          // this.dataSource = new MatTableDataSource(this.listaCargos)
          this.dataSource = new MatTableDataSource(this.carguito)
          this.dataSource.paginator = this.paginator;
        })
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(cargo: Cargos) {
    this.servicioServices.seleccionarCargo = Object.assign({}, cargo)
  }


  onDelete($key: string) {
    if (confirm('¿Esta seguro de querer eliminarlo?')) {
      this.servicioServices.deleteCargos($key);
      this.notificaciones.success('Exitosamente', 'Cargo eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar: true
        })
    }
  }
}