import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  listaMenu:string[] = ['Registro','Multas','Código de Infracciones de Transporte','Administrador','Salir']
  constructor() { }

  ngOnInit() {
  }

}
