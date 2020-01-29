import { GestionUsuario } from './../../../models/gestionarUsuarios/gestion-usuario';
import { Boleta } from './../../../models/boletaInfraccion/boleta';
import { Component, OnInit, ViewChild } from '@angular/core';


import {
  AngularFireDatabase
} from 'angularfire2/database';
import * as firebase from 'firebase/app'

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
// import {userOptions} from 'jspdf-autotable';
// import html2canvas from 'html2canvas';

import {
  PdfMakeWrapper
} from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ServiciosService } from 'src/app/services/servicios.service';
import { FormBuilder, NgForm } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-registros-por-policia',
  templateUrl: './registros-por-policia.component.html',
  styleUrls: ['./registros-por-policia.component.css']
})
export class RegistrosPorPoliciaComponent implements OnInit {

  listaBoleta: GestionUsuario[]

  // displayedColumns: string[] = ['placa', 'fechaInfraccion', 'nombreInfractor', 'nombrePersonal'];
  displayedColumns: string[] = ['nombrePersonal'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  seleccionado
  constructor(public servicioServices: ServiciosService,
    public builder: FormBuilder,
    private db: AngularFireDatabase, ) {

    // Comprobando si existe o no el cargo
    db.list('gestionUsuarios').snapshotChanges()
      .subscribe(item => {
        this.listaBoleta = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.listaBoleta.push(x as GestionUsuario);
        })
      })
    // this.buscar()
  }

  dataSource = new MatTableDataSource(this.listaBoleta)

  nombrePolicias;
  apPaternoPolicia;
  fechas;
  descripcionIncidente;
  grado;

  datos:Boleta[];

  ciUser
  locations
  nom
  expression = false

  buscar() {
    this.db.list('boletaInfraccion').snapshotChanges()
      .subscribe(item => {
        this.datos = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.datos.push(x as Boleta);
          console.log(this.datos);
          
        })
      })

    

    // this.expression = true

    // var ref = firebase.database().ref('personalTransito')
    // var ref2 = firebase.database().ref('boletaInfraccion')

    // ref.orderByChild('ciPersonal').equalTo(this.locations).on("child_added", snap => {
    //   this.nom = snap.val().nombrePersonal
      
    //   ref2.orderByChild('nombrePersonal').equalTo('Roberto').on("child_added", snap2 => {

    //     let x= snap2.val().payload.toJSON();
    //        x["$key"]=snap2.val().key;
    //     this.datos.push(x as Boleta);
    //     console.log(this.datos);
    //   })
    // })
    }

  ngOnInit() {






      // this.servicioServices.getInfracciones()
      // .snapshotChanges()
      // .subscribe(item=>{
      //   this.listaBoleta=[];
      //   item.forEach(element=>{
      //     let x= element.payload.toJSON();
      //     x["$key"]=element.key;
      //     this.listaBoleta.push(x as Boleta)
      //     this.dataSource = new MatTableDataSource(this.listaBoleta)
      //     this.dataSource.paginator = this.paginator;
      //     // console.log(this.listaBoleta);  
      //   })
      // })
    }

  convertHtmlPdf()
  {
        var div = document.getElementById("tabla")
    var pdf = new jspdf({
          orientation: 'landscape',
          // unit: 'cm',
          format: 'carta'
        })
    pdf.text("REGISTRO DE VEHICULOS INFRACCIONADOS", 80, 10);
        pdf.fromHTML(div, 10, 30);
        pdf.save('archivo.pdf')
      }

}
