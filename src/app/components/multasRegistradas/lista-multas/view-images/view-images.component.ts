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
  @Input() verNombreFoto1view
  @Input() verNombreFoto2view

  constructor() { 
    

    // let verNombreFoto1 = multas.foto1
    // let verNombreFoto2 = multas.foto2

    // let link;

    // var storage = firebase.storage();
    // var pathReference = storage.ref();  

    // pathReference.child('infracciones/'+verNombreFoto1).getDownloadURL().then( url=> this.myimg1 = url);
    // pathReference.child('infracciones/'+verNombreFoto2).getDownloadURL().then( url=> this.myimg2 = url);
  }

  ngOnInit() {

    var storage = firebase.storage();
    var pathReference = storage.ref(); 
    pathReference.child('infracciones/'+this.verNombreFoto1view).getDownloadURL().then( url=> this.myimg1 = url);
    pathReference.child('infracciones/'+this.verNombreFoto2view).getDownloadURL().then( url=> this.myimg2 = url);
  }

}
