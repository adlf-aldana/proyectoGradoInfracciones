import { async } from '@angular/core/testing';
import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app'
import { Boleta } from 'src/app/models/boletaInfraccion/boleta';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.css']
})
export class ViewImagesComponent implements OnInit {
  myimg1
  myimg2
  @Input() verNombreFoto: string;
  // @Input() verNombreFoto2view

  constructor() { 
  
  }
  
  ngOnInit() {
    // console.log(this.verNombreFoto);
    console.log(this.myimg2);
    
this.cargandoImg()
    
  
  }

  async cargandoImg()
  {
    var storage = firebase.storage();
    var pathReference = storage.ref();

    await pathReference.child('fotoMultas/'+this.verNombreFoto).getDownloadURL().then( url=> this.myimg2 = url);
  }

}
