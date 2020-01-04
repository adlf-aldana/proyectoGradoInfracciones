import { Boleta } from './../../../models/boletaInfraccion/boleta';
import { element } from 'protractor';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import {
  AngularFireDatabase
} from 'angularfire2/database';
import * as firebase from 'firebase/app'

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
// import {userOptions} from 'jspdf-autotable';
import html2canvas from 'html2canvas';

import {
  PdfMakeWrapper
} from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ServiciosService } from 'src/app/services/servicios.service';
import { FormBuilder } from '@angular/forms';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-registro-vehiculos-infraccionados',
  templateUrl: './registro-vehiculos-infraccionados.component.html',
  styleUrls: ['./registro-vehiculos-infraccionados.component.css']
})
export class RegistroVehiculosInfraccionadosComponent implements OnInit {

  listaBoleta: Boleta[]
  
  displayedColumns: string[] = ['placa', 'fechaInfraccion', 'nombreInfractor','descripcion', 'nombrePersonal', 'grado'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  meses: any = [
    { num: 1, lit: 'Enero' },
    { num: 2, lit: 'Febrero' },
    { num: 3, lit: 'Marzo' },
    { num: 4, lit: 'Abril' },
    { num: 5, lit: 'Mayo' },
    { num: 6, lit: 'Junio' },
    { num: 7, lit: 'Julio' },
    { num: 8, lit: 'Agosto' },
    { num: 10, lit: 'Septiembre' },
    { num: 11, lit: 'Octubre' },
    { num: 11, lit: 'Noviembre' },
    { num: 12, lit: 'Diciembre' }
  ]

  seleccionado
  constructor(
    public servicioServices: ServiciosService,
    public builder: FormBuilder,
    private firebase: AngularFireDatabase,
  ) { }

  dataSource = new MatTableDataSource(this.listaBoleta)

  ngOnInit() {
    this.servicioServices.getInfracciones()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaBoleta=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaBoleta.push(x as Boleta)
        this.dataSource = new MatTableDataSource(this.listaBoleta)
        this.dataSource.paginator = this.paginator;
        // console.log(this.listaBoleta);  
      })
    })
    // this.dataSource.paginator = this.paginator;
  }

  generar() {
  };
  convertHtmlPdf()
  {
    let fecha = new Date();
    let fechaFinal = fecha.getDate() + '/' + (fecha.getMonth()+1) + '/' + fecha.getFullYear();

    var div = document.getElementById("tabla")
    var pdf = new jspdf(
        
        // unit: 'cm',
        'p',
        'pt',
        'letter'
      )

    pdf.text("REGISTRO DE VEHICULOS INFRACCIONADOS",80,30);
    pdf.setFontSize(12)
    pdf.text("Fecha: "+fechaFinal,3,50)

    pdf.setFontSize(5)
    pdf.fromHTML(div,10,70);
    pdf.save('reporteVehiculosInfraccionados.pdf')
  }

}
