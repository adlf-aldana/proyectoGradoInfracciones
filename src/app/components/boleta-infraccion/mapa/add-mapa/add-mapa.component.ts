import { Component, OnInit } from '@angular/core';
import { AddBoletaComponent } from '../../add-boleta/add-boleta.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-mapa',
  templateUrl: './add-mapa.component.html',
  styleUrls: ['./add-mapa.component.css']
})
export class AddMapaComponent implements OnInit {

  lat: number = -19.0397905;
  lng: number = -65.2571159;

  constructor() { }

  ngOnInit() {
  }

  enviarCoordenadas()
  {
  }

}
