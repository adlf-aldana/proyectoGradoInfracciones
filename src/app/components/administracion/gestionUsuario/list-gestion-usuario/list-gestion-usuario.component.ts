import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-gestion-usuario',
  templateUrl: './list-gestion-usuario.component.html',
  styleUrls: ['./list-gestion-usuario.component.css']
})
export class ListGestionUsuarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  busquedaPersonal(usuarioTransito: NgForm)
  {
    console.log(usuarioTransito.value);
  }

}
