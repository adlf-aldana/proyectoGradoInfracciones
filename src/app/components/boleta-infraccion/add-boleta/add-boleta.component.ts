import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NotificationsService
} from 'angular2-notifications';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormControl
} from '@angular/forms';
import {
  AngularFireDatabase
} from 'angularfire2/database';
import * as firebase from 'firebase/app'
import {
  equal,
  strictEqual
} from 'assert';
import {
  Boleta
} from 'src/app/models/boletaInfraccion/boleta';
import * as jsPDF from 'jspdf'
import {
  PdfMakeWrapper
} from 'pdfmake-wrapper';
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
  WebcamImage,
  WebcamInitError,
  WebcamUtil
} from 'ngx-webcam'
import {
  Subject,
  Observable
} from 'rxjs';
import {
  AngularFireStorage
} from 'angularfire2/storage';

import {
  AuthService
} from '../../../services/auth.service'
import {
  IfStmt
} from '@angular/compiler';


@Component({
  selector: 'app-add-boleta',
  templateUrl: './add-boleta.component.html',
  styleUrls: ['./add-boleta.component.css']
})


export class AddBoletaComponent implements OnInit {

  uploadPercent: Observable < number > ;
  date = new Date();
  nombreFoto1: any
  nombreFoto2: any
  // nombreFoto3: any
  // nombreFoto4: any
  // nombreFoto5: any

  anio = this.date.getFullYear()
  mes = this.date.getMonth()
  dia = this.date.getDay()
  hora = this.date.getHours()
  minutos = this.date.getMinutes()
  segundo = this.date.getSeconds()

  datosBoleta: FormGroup

  lat: number;
  lng: number;

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private firebase: AngularFireDatabase,
    private storage: AngularFireStorage,
    public authService: AuthService

  ) {
    this.datosBoleta = this.builder.group({
      $key: [],
      placa: ['', Validators.required],
      art: ['', Validators.required],
      num: ['', Validators.required],
      lat: [''],
      lng: [''],
      foto1: [],
      foto2: [],
      foto3: [],
      foto4: [],
      foto5: [],
      descripcion: ['', Validators.required],

      nombreInfractor: ['', Validators.required],
      apPaternoInfractor: ['', Validators.required],
      apMaternoInfractor: ['', Validators.required],
      numLicenciaInfractor: ['', Validators.required],
      tipoVehiculo: [],
      marcaVehiculo: [],
      colorVehiculo: [],

      nombrePersonal: ['', Validators.required],
      apPaternoPersonal: ['', Validators.required],
      apMaternoPersonal: ['', Validators.required],
      ciPersonal: []
    });
  }

  file
  filePath
  uploadFile1(event) {
    this.file = event.target.files[0];
    this.nombreFoto1 = this.anio + '!' + this.mes + '!' + this.dia + '!' + this.hora + '!' + this.minutos + '!' + this.segundo +'#1';
  }

  uploadFile2(event) {
    this.file = event.target.files[0];
    this.nombreFoto2 = this.anio + '!' + this.mes + '!' + this.dia + '!' + this.hora + '!' + this.minutos + '!' + this.segundo +'#1';
  }

  // uploadFile3(event) {
  //   this.file = event.target.files[0];
  //   this.nombreFoto3 = this.anio + '!' + this.mes + '!' + this.dia + '!' + this.hora + '!' + this.minutos + '!' + this.segundo +'#1';
  // }

  // uploadFile4(event) {
  //   this.file = event.target.files[0];
  //   this.nombreFoto4 = this.anio + '!' + this.mes + '!' + this.dia + '!' + this.hora + '!' + this.minutos + '!' + this.segundo +'#1';
  // }

  // uploadFile5(event) {
  //   this.file = event.target.files[0];
  //   this.nombreFoto5 = this.anio + '!' + this.mes + '!' + this.dia + '!' + this.hora + '!' + this.minutos + '!' + this.segundo +'#1';
  // }


  ngOnInit() {
    this.getUserLocation()
    this.servicioServices.getInfracciones();
    this.resetForm()

    var ref = firebase.database().ref('gestionUsuarios');
    var datos = firebase.database().ref('personalTransito');
    ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
      var ci = snap.val().ciUsuario;
      let grado = snap.val().cargoUsuario;
      document.getElementById('grado').innerHTML = grado

      datos.orderByChild('ciPersonal').equalTo(ci).on("child_added", snap => {

        let nombrePersonal = snap.val().nombrePersonal;
        document.getElementById('nombrePersonal').innerHTML = nombrePersonal

        let apPaternoPersonal = snap.val().apPaternoPersonal;
        document.getElementById('apPaternoPersonal').innerHTML = apPaternoPersonal

        let apMaternoPersonal = snap.val().apMaternoPersonal;
        document.getElementById('apMaternoPersonal').innerHTML = apMaternoPersonal

        let ciPersonal = snap.val().ciPersonal;
        document.getElementById('cedulaIdentidad').innerHTML = ciPersonal

        this.datosBoleta.patchValue({
          nombrePersonal: nombrePersonal,
          apPaternoPersonal: apPaternoPersonal,
          apMaternoPersonal: apMaternoPersonal,
          ciPersonal: ciPersonal
        })

      })
    })



  }

  public getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  addBoleta(datosBoleta: NgForm) {


    if (this.nombreFoto1=== undefined && this.nombreFoto2 === undefined) {
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
      })
    } else if(this.nombreFoto1 != undefined && this.nombreFoto2 === undefined){
      const task = this.storage.upload(this.filePath, this.file)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto1: this.nombreFoto1
      })
    }
    else if( this.nombreFoto1 === undefined && this.nombreFoto2 != undefined ){
      const task = this.storage.upload(this.filePath, this.file)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto2: this.nombreFoto2
      })
    }
    else {
      this.filePath = 'infracciones/' + this.nombreFoto1
      const task = this.storage.upload(this.filePath, this.file)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto1: this.nombreFoto1,
        foto2: this.nombreFoto2
      })
    }

    if (datosBoleta.value.$key == null) {
      //this.servicioServices.insertInfracciones(datosBoleta.value);
      this.notificaciones.success('Exitosamente', 'Item guardado correctamente', {
        timeOut: 1000,
        showProgressBar: true
      })
      console.log('noti');
    } else {
      this.servicioServices.updateInfraccion(datosBoleta.value)
      this.notificaciones.success('Exitosamente', 'Item actualizado correctamente', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
    //this.resetForm(datosBoleta)
  }

  resetForm(serviciBoleta ? : NgForm) {
    if (serviciBoleta != null) {
      serviciBoleta.reset();
      this.servicioServices.seleccionarInfraccion = new Boleta();
    }
  }

  nuevoInfractor() {}

  generarPDF() {

    PdfMakeWrapper.setFonts(pdfFonts);

    const doc = new jsPDF('p', 'mm', [279, 120]) //('p','mm',[297, 210]);

    let placaVehiculo: string = (document.getElementById('placaVehiculo') as HTMLInputElement).value;

    var ref = firebase.database().ref('datosVehiculo');
    ref.orderByChild('placa').equalTo(placaVehiculo).on("child_added", snap => {

      let nomInfractor = snap.val().nombreInfractor;
      let apPatInfractor = snap.val().apPaternoInfractor;
      let apMatInfractor = snap.val().apMaternoInfractor;
      let numLicencia = snap.val().numLicencia;
      let tipoVehiculo = snap.val().tipoVehiculo;
      let marcaVehiculo = snap.val().marcaVehiculo;
      let colorVehiculo = snap.val().colorVehiculo;
      let placa = snap.val().placa;

      doc.setFontSize(5);
      doc.text(5.4, 6, 'ESTADO PLURINACIONAL DE BOLIVIA');
      doc.setFontSize(9);
      doc.text(5, 10, 'BOLETA INFRACCION');

      doc.setFontSize(5);
      doc.text(11, 15, 'Fecha y Hora:');

      doc.setFontSize(5);
      doc.text(3, 20, 'Placa N° ' + placa);

      doc.setFontSize(5);
      doc.text(22, 20, 'Licencia N° ' + numLicencia);

      doc.setFontSize(5);
      doc.text(3, 23, 'Infractor ' + nomInfractor + ' ' + apPatInfractor + ' ' + apMatInfractor);

      doc.save('infraccion.pdf');
    })
  }

  validarCodigoInfraccion() {
    let art: string = (document.getElementById('art') as HTMLInputElement).value;
    let num: string = (document.getElementById('num') as HTMLInputElement).value;

    var ref = firebase.database().ref('codigosTransito')
    ref.orderByChild('articulo').equalTo(art).orderByChild('num').equalTo(num).on("child_added", snap => {
      console.log(snap.val().descripcion);

    })
  }

  comprobarInfractor() {

    let placaVehiculo: string = (document.getElementById('placa') as HTMLInputElement).value;

    var ref = firebase.database().ref('datosVehiculo')
    ref.orderByChild('placa').equalTo(placaVehiculo).on("child_added", snap => {

      let nombreInfractor = snap.val().nombreInfractor;
      document.getElementById('nombre').innerHTML = nombreInfractor

      let apPaternoInfractor = snap.val().apPaternoInfractor;
      document.getElementById('apPaterno').innerHTML = apPaternoInfractor;

      let apMaternoInfractor = snap.val().apMaternoInfractor;
      document.getElementById('apMaterno').innerHTML = apMaternoInfractor;

      let numLicencia = snap.val().numLicencia;
      document.getElementById('numLicencia').innerHTML = numLicencia;

      let tipoVehiculo = snap.val().tipoVehiculo;
      document.getElementById('tipoVehiculo').innerHTML = tipoVehiculo

      let marcaVehiculo = snap.val().marcaVehiculo;
      document.getElementById('marcaVehiculo').innerHTML = marcaVehiculo

      let colorVehiculo = snap.val().colorVehiculo;
      document.getElementById('colorVehiculo').innerHTML = colorVehiculo

      this.datosBoleta.patchValue({
        nombreInfractor: nombreInfractor,
        apPaternoInfractor: apPaternoInfractor,
        apMaternoInfractor: apMaternoInfractor,
        numLicenciaInfractor: numLicencia,
        tipoVehiculo: tipoVehiculo,
        marcaVehiculo: marcaVehiculo,
        colorVehiculo: colorVehiculo
      })

    })

  }
}
