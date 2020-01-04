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
  IfStmt, ElementSchemaRegistry
} from '@angular/compiler';
import { DatePipe } from '@angular/common';
import { Logs } from 'selenium-webdriver';


@Component({
  selector: 'app-add-boleta',
  templateUrl: './add-boleta.component.html',
  styleUrls: ['./add-boleta.component.css']
})


export class AddBoletaComponent implements OnInit {

  uploadPercent: Observable<number>;

  nombreFoto1: any
  nombreFoto2: any
  // nombreFoto3: any
  // nombreFoto4: any
  // nombreFoto5: any




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
      fechaInfraccion: [],
      placa: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      art: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      num: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      lat: [''],
      lng: [''],
      foto1: [],
      fotito1: [],
      foto2: [],
      fotito2: [],
      foto3: [],
      foto4: [],
      foto5: [],
      descripcion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(46)]],

      nombreInfractor: ['',],
      apPaternoInfractor: ['',],
      apMaternoInfractor: ['',],
      numLicenciaInfractor: ['',],
      celularInfractor: ['',],
      tipoVehiculo: [],
      marcaVehiculo: [],
      colorVehiculo: [],
      servicioVehiculo: [],

      nombreTestigo: [],
      apPaternoTestigo: [],
      apMaternoTestigo: [],
      cedulaIdentidadTestigo: [],
      celularTestigo: [],

      nombrePersonal: ['',],
      apPaternoPersonal: ['',],
      apMaternoPersonal: ['',],
      ciPersonal: []
    });
  }


  file1
  file2
  filePath1
  filePath2
  date = new Date()
  uploadFile1(event) {
    this.date = new Date();
    let anio = this.date.getFullYear()
    let mes = this.date.getMonth() + 1;
    let dia = this.date.getDate()
    let hora = this.date.getHours()
    let minutos = this.date.getUTCMinutes()
    let segundo = this.date.getUTCSeconds()

    let placa = (document.getElementById('placa') as HTMLInputElement).value;
    
    if (placa != undefined) {
      this.file1 = event.target.files[0];
      // this.nombreFoto1 = placa +'!'+ anio + '!' + mes + '!' + dia + '!' + hora + '!' + minutos + '!' + segundo + '#1';
      this.nombreFoto1 = placa + '!' + anio + '!' + mes + '!' + dia + '#1';
    }
    else
      this.notificaciones.error('Error', 'Primero introduzca la placa del infractor', {
        position: ["top", "left"],
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        lastOnBottom: true,
        animate: "fromLeft"
      })
  }

  uploadFile2(event) {
    let date = new Date();
    let anio = date.getFullYear()
    let mes = date.getMonth() + 1
    let dia = date.getDate()
    let hora = date.getHours()
    let minutos = date.getUTCMinutes()
    let segundo = date.getUTCSeconds()
    this.file2 = event.target.files[0];

    let placa = (document.getElementById('placa') as HTMLInputElement).value;

    if (placa != undefined) {
      this.nombreFoto2 = placa + '!' + anio + '!' + mes + '!' + dia + '#2';
    } else {
      this.notificaciones.error('Error', 'Primero introduzca la placa del infractor', {
        position: ["top", "left"],
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        lastOnBottom: true,
        animate: "fromLeft"
      })
    }

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
    let correo = this.authService.correo
    this.getUserLocation()
    this.servicioServices.getInfracciones();
    this.resetForm()

    var ref = firebase.database().ref('gestionUsuarios');
    var datos = firebase.database().ref('personalTransito');
    // ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
    // ref.orderByChild('correoUsuario').equalTo('a<dolfo@gmail.com').on("child_added", snap => {
    ref.orderByChild('correoUsuario').equalTo(correo).on("child_added", snap => {
      var ci = snap.val().ciUsuario;
      let grado = snap.val().cargoUsuario;
      document.getElementById('grado').innerHTML = grado

      datos.orderByChild('ciPersonal').equalTo(ci).on("child_added", snap => {

        let nombrePersonal = snap.val().nombrePersonal;
        document.getElementById('nomPersonal').innerHTML = nombrePersonal

        let apPaternoPersonal = snap.val().apPaternoPersonal;
        document.getElementById('apPatPersonal').innerHTML = apPaternoPersonal

        let apMaternoPersonal = snap.val().apMaternoPersonal;
        document.getElementById('apMatPersonal').innerHTML = apMaternoPersonal

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
    let fechaInfraccion
    if ((this.date.getMonth() + 1) < 10)
      fechaInfraccion = this.date.getDate() + '/0' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear()
    else
      fechaInfraccion = this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear()
    this.datosBoleta.patchValue({
      fechaInfraccion: fechaInfraccion
    })

    if (this.nombreFoto1 === undefined && this.nombreFoto2 === undefined) {
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
      })
    } else if (this.nombreFoto1 != undefined && this.nombreFoto2 === undefined) {
      const task = this.storage.upload(this.filePath1, this.file1)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto1: this.nombreFoto1
      })
    }
    else if (this.nombreFoto1 === undefined && this.nombreFoto2 != undefined) {
      const task = this.storage.upload(this.filePath2, this.file2)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto2: this.nombreFoto2
      })
    }
    else {
      this.filePath1 = 'infracciones/' + this.nombreFoto1
      this.filePath2 = 'infracciones/' + this.nombreFoto2
      const task1 = this.storage.upload(this.filePath1, this.file1)
      const task2 = this.storage.upload(this.filePath2, this.file2)
      this.datosBoleta.patchValue({
        lat: this.lat,
        lng: this.lng,
        foto1: this.nombreFoto1,
        foto2: this.nombreFoto2
      })
    }

    if (datosBoleta.value.$key == null) {
      this.servicioServices.insertInfracciones(datosBoleta.value);
      this.notificaciones.success('Exitosamente', 'Item guardado correctamente', {
        position: ["top", "left"],
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        lastOnBottom: true,
        animate: "fromLeft"
      })
      this.generarPDF();
    }
    // else {
    //   this.servicioServices.updateInfraccion(datosBoleta.value)
    //   this.notificaciones.success('Exitosamente', 'Item actualizado correctamente', {
    //     timeOut: 3000,
    //     showProgressBar: true
    //   })
    // }
    this.resetForm(datosBoleta)
  }

  resetForm(serviciBoleta?: NgForm) {
    if (serviciBoleta != null) {
      serviciBoleta.reset();
      this.servicioServices.seleccionarInfraccion = new Boleta();
    }

    document.getElementById('nomTestigo').innerHTML = ''
      document.getElementById('apPatTestigo').innerHTML = '';
      document.getElementById('apMatTestigo').innerHTML = '';
      document.getElementById('ciTestigo').innerHTML = '';
      document.getElementById('celularTestigo').innerHTML = '';

      document.getElementById('nombre').innerHTML = ''
      document.getElementById('apPaterno').innerHTML = '';
      document.getElementById('apMaterno').innerHTML = '';
      document.getElementById('numLicencia').innerHTML = '';
      document.getElementById('tipoVehiculo').innerHTML = ''
      document.getElementById('marcaVehiculo').innerHTML = ''
      document.getElementById('colorVehiculo').innerHTML = ''
      document.getElementById('servicioVehiculo').innerHTML = ''

      document.getElementById('fotito1').innerHTML = ''
      document.getElementById('fotito2').innerHTML = ''

      document.getElementById('foto1').innerHTML = ''
      document.getElementById('foto2').innerHTML = ''


  }

  nuevoInfractor() { }

  generarPDF() {
    const date = new Date();

    let anio = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate()
    let hora = date.getHours();
    let minutos = date.getMinutes();

    PdfMakeWrapper.setFonts(pdfFonts);

    const doc = new jsPDF('p', 'mm', [279, 135]) //('p','mm',[297, 210]);

    let placaVehiculo: string = (document.getElementById('placa') as HTMLInputElement).value;

    var ref = firebase.database().ref('datosVehiculo');
    ref.orderByChild('placa').equalTo(placaVehiculo).on("child_added", snap => {

      let nomInfractor
      let apPatInfractor
      let apMatInfractor
      let numLicencia
      let tipoVehiculo
      let marcaVehiculo
      let colorVehiculo
      let placa
      let servicioVehicular

      if (snap.val().nombreInfractor === undefined) {
        console.log(snap.val().tipoServicio);

        nomInfractor = '';
        apPatInfractor = '';
        apMatInfractor = '';
        numLicencia = '';
        tipoVehiculo = snap.val().tipoVehiculo;
        marcaVehiculo = snap.val().marcaVehiculo;
        colorVehiculo = snap.val().colorVehiculo;
        placa = snap.val().placa;
        servicioVehicular = snap.val().tipoServicio;

      } else {
        nomInfractor = snap.val().nombreInfractor;
        apPatInfractor = snap.val().apPaternoInfractor;
        apMatInfractor = snap.val().apMaternoInfractor;
        numLicencia = snap.val().numLicencia;
        tipoVehiculo = snap.val().tipoVehiculo;
        marcaVehiculo = snap.val().marcaVehiculo;
        colorVehiculo = snap.val().colorVehiculo;
        placa = snap.val().placa;
        servicioVehicular = snap.val().tipoServicio;
      }

      let art: string = (document.getElementById('art') as HTMLInputElement).value;
      let num: string = (document.getElementById('num') as HTMLInputElement).value;

      let descripcion: string = (document.getElementById('descripcion') as HTMLInputElement).value;

      let nombrePersonal: string = (document.getElementById('nombrePersonal') as HTMLInputElement).value;
      let apPaternoPersonal: string = (document.getElementById('apPaternoPersonal') as HTMLInputElement).value;
      let apMaternoPersonal: string = (document.getElementById('apMaternoPersonal') as HTMLInputElement).value;

      let nombreTestigo: string = (document.getElementById('nombreTestigo') as HTMLInputElement).value;
      let apPaternoTestigo: string = (document.getElementById('apPaternoTestigo') as HTMLInputElement).value;
      let apMaternoTestigo: string = (document.getElementById('apMaternoTestigo') as HTMLInputElement).value;
      let ciTestigo: string = (document.getElementById('cedulaIdentidadTestigo') as HTMLInputElement).value;

      doc.setFontSize(5);
      doc.setFontType("bold");
      doc.text(5.4, 6, 'ESTADO PLURINACIONAL DE BOLIVIA');
      var logo = new Image();
      logo.src = 'data:image/jpeg;base64,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';
      doc.addImage(logo, 'PNG', 6, 7, 8, 8);

      doc.setFontSize(4);
      doc.setFontType("bold");
      doc.text(30, 10, 'Servicio:');
      doc.setFontSize(4);
      doc.setFontType("normal")
      doc.text(28, 13, '' + servicioVehicular);

      doc.setFontSize(9);
      doc.text(8, 20, 'BOLETA INFRACCION');

      /*** HORA Y FECHA *****/
      doc.rect(6.5, 22, 10.2, 4)
      doc.rect(16.7, 22, 7, 4)
      doc.rect(23.7, 22, 8, 4)
      doc.rect(31.6, 22, 10, 4)
      doc.setFontSize(5);
      if (minutos < 10) {
        doc.setFontType("bold");
        doc.text(7, 25, 'Hora: ')
        doc.setFontType("normal")
        doc.text(12, 25, '' + hora + ':0' + minutos);
      }
      else {
        doc.setFontType("bold");
        doc.text(7, 25, 'Hora: ')
        doc.setFontType("normal")
        doc.text(12, 25, '' + hora + ':' + minutos);
      }

      doc.setFontSize(5);
      if (dia < 10) {
        doc.setFontType("bold");
        doc.text(17, 25, 'Dia: ');
        doc.setFontType("normal");
        doc.text(21, 25, '0' + dia);
      }
      else {
        doc.setFontType("bold");
        doc.text(17, 25, 'Dia: ');
        doc.setFontType("normal");
        doc.text(21, 25, '' + dia);
      }

      doc.setFontSize(5);
      if (mes < 10) {
        doc.setFontType("bold");
        doc.text(24, 25, 'Mes: ');
        doc.setFontType("normal");
        doc.text(29, 25, '0' + mes);
      }
      else {
        doc.setFontType("bold");
        doc.text(24, 25, 'Mes: ');
        doc.setFontType("normal");
        doc.text(29, 25, '' + mes);
      }

      doc.setFontSize(5);
      doc.setFontType("bold");
      doc.text(32, 25, 'Año: ');
      doc.setFontType("normal");
      doc.text(37, 25, '' + anio);

      doc.rect(2, 27, 43.5, 11)
      doc.setFontSize(4);
      doc.setFontType("bold");
      doc.text(17, 29, 'DATOS INFRACTOR');
      doc.setFontType("bold");
      doc.text(3, 31, 'Nombre del Conductor: ');
      doc.setFontType("normal");
      doc.text(3, 33, nomInfractor + ' ' + apPatInfractor + ' ' + apMatInfractor);
      doc.setFontType("bold");
      doc.text(3, 36, 'Licencia N°: ');
      doc.setFontType("normal");
      doc.text(12, 36, numLicencia);

      doc.rect(2, 40, 22, 12)
      doc.setFontType("bold");
      doc.text(9, 42, 'VEHICULO');
      doc.setFontType("bold");
      doc.text(3, 45, 'Placa: ');
      doc.setFontType("normal");
      doc.text(8, 45, placa);
      doc.setFontType("bold");
      doc.text(3, 47, 'Tipo: ');
      doc.setFontType("normal");
      doc.text(8, 47, tipoVehiculo);
      doc.setFontType("bold");
      doc.text(3, 49, 'Marca: ');
      doc.setFontType("normal");
      doc.text(8, 49, marcaVehiculo);
      doc.setFontType("bold");
      doc.text(3, 51, 'Color: ');
      doc.setFontType("normal");
      doc.text(9, 51, colorVehiculo);

      doc.rect(25, 40, 20, 12);
      doc.setFontType("bold");
      doc.text(25.5, 42, 'UBICACION DE INFRACCION');
      doc.setFontType("bold");
      doc.text(25.5, 45, 'Lat: ');
      doc.setFontType("normal");
      doc.text(28, 45, '' + this.lat);
      doc.setFontType("bold");
      doc.text(25.5, 48, 'Long: ');
      doc.setFontType("normal");
      doc.text(30, 48, '' + this.lng);

      doc.rect(2, 53, 43.5, 15)
      doc.setFontType("bold");
      doc.text(15, 55, 'TIPO DE INFRACCION');
      doc.setFontType("bold");
      doc.text(3, 58, 'Art.: ');
      doc.setFontType("normal");
      doc.text(7, 58, art);
      doc.setFontType("bold");
      doc.text(12, 58, 'Num.: ');
      doc.setFontType("normal");
      doc.text(16, 58, num);
      doc.setFontType("bold");
      doc.text(3, 61, 'Obs.: ');
      doc.setFontType("normal");
      doc.text(3, 63, descripcion);

      doc.rect(2, 69, 43.5, 14)
      doc.setFontType("bold");
      doc.text(16, 71, 'DATOS TESTIGO');
      doc.setFontType("bold");
      doc.text(3, 74, 'Nombre Testigo: ');
      doc.setFontType("normal");
      doc.text(3, 76, nombreTestigo + ' ' + apPaternoTestigo + ' ' + apMaternoTestigo);
      doc.setFontType("bold");
      doc.text(3, 79, 'Cedula de Identidad del Testigo: ');
      doc.setFontType("normal");
      doc.text(25, 79, ciTestigo);

      doc.rect(2, 84, 43.5, 7)
      doc.setFontType("bold");
      doc.text(11, 86, 'NOMBRE FUNCIONARIO POLICIAL');
      doc.setFontType("normal");
      doc.text(3, 88, nombrePersonal + ' ' + apPaternoPersonal + ' ' + apMaternoPersonal);



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

  comprobarTestigo() {
    let cedulaIdentidadTestigo: string = (document.getElementById('cedulaIdentidadTestigo') as HTMLInputElement).value;

    var ref = firebase.database().ref('testigos')
    ref.orderByChild('cedulaIdentidadTestigo').equalTo(cedulaIdentidadTestigo).on("child_added", snap => {

      let nombreTestigo
      let apPaternoTestigo
      let apMaternoTestigo
      let cedulaIdentidadTestigo
      let celularTestigo

      if (snap.val().celularTestigo === undefined) {
        nombreTestigo = snap.val().nombreTestigo;
        apPaternoTestigo = snap.val().apPaternoTestigo;
        apMaternoTestigo = snap.val().apMaternoTestigo;
        cedulaIdentidadTestigo = snap.val().cedulaIdentidadTestigo;
        celularTestigo = ''
      } else {
        nombreTestigo = snap.val().nombreTestigo;
        apPaternoTestigo = snap.val().apPaternoTestigo;
        apMaternoTestigo = snap.val().apMaternoTestigo;
        cedulaIdentidadTestigo = snap.val().cedulaIdentidadTestigo;
        celularTestigo = snap.val().celularTestigo;
      }

      document.getElementById('nomTestigo').innerHTML = nombreTestigo
      document.getElementById('apPatTestigo').innerHTML = apPaternoTestigo;
      document.getElementById('apMatTestigo').innerHTML = apMaternoTestigo;
      document.getElementById('ciTestigo').innerHTML = cedulaIdentidadTestigo;
      document.getElementById('celularTestigo').innerHTML = celularTestigo;

      // if(celularTestigo===undefined){
      this.datosBoleta.patchValue({
        nombreTestigo: nombreTestigo,
        apPaternoTestigo: apPaternoTestigo,
        apMaternoTestigo: apMaternoTestigo,
        ciTestigo: cedulaIdentidadTestigo
      })
      // }else{
      //   this.datosBoleta.patchValue({
      //     nombreTestigo: nombreTestigo,
      //   apPaternoTestigo: apPaternoTestigo,
      //   apMaternoTestigo: apMaternoTestigo,
      //   ciTestigo: cedulaIdentidadTestigo,
      //   celularTetigo: celularTestigo,
      //   })

      // }

    })

  }

  comprobarInfractor() {
    document.getElementById('nombre').innerHTML = ''
    document.getElementById('apPaterno').innerHTML = ''
    document.getElementById('apMaterno').innerHTML = ''
    document.getElementById('numLicencia').innerHTML = ''
    document.getElementById('tipoVehiculo').innerHTML = ''
    document.getElementById('marcaVehiculo').innerHTML = ''
    document.getElementById('colorVehiculo').innerHTML = ''
    document.getElementById('servicioVehiculo').innerHTML = ''

    let placaVehiculo: string = (document.getElementById('placa') as HTMLInputElement).value;

    var ref = firebase.database().ref('datosVehiculo')
    ref.orderByChild('placa').equalTo(placaVehiculo).on("child_added", snap => {
      let nombreInfractor
      let apPaternoInfractor
      let apMaternoInfractor
      let numLicencia
      let tipoVehiculo
      let marcaVehiculo
      let colorVehiculo
      let servicioVehiculo


      if (snap.val().nombreInfractor === undefined) {
        nombreInfractor = '';
        apPaternoInfractor = '';
        apMaternoInfractor = '';
        numLicencia = '';
        tipoVehiculo = snap.val().tipoVehiculo;
        marcaVehiculo = snap.val().marcaVehiculo;
        colorVehiculo = snap.val().colorVehiculo;
        servicioVehiculo = snap.val().tipoServicio;
      }
      else {
        nombreInfractor = snap.val().nombreInfractor;
        apPaternoInfractor = snap.val().apPaternoInfractor;
        apMaternoInfractor = snap.val().apMaternoInfractor;
        numLicencia = snap.val().numLicencia;
        tipoVehiculo = snap.val().tipoVehiculo;
        marcaVehiculo = snap.val().marcaVehiculo;
        colorVehiculo = snap.val().colorVehiculo;
        servicioVehiculo = snap.val().tipoServicio;
      }

      document.getElementById('nombre').innerHTML = nombreInfractor
      document.getElementById('apPaterno').innerHTML = apPaternoInfractor;
      document.getElementById('apMaterno').innerHTML = apMaternoInfractor;
      document.getElementById('numLicencia').innerHTML = numLicencia;
      document.getElementById('tipoVehiculo').innerHTML = tipoVehiculo
      document.getElementById('marcaVehiculo').innerHTML = marcaVehiculo
      document.getElementById('colorVehiculo').innerHTML = colorVehiculo
      document.getElementById('servicioVehiculo').innerHTML = servicioVehiculo

      this.datosBoleta.patchValue({
        nombreInfractor: nombreInfractor,
        apPaternoInfractor: apPaternoInfractor,
        apMaternoInfractor: apMaternoInfractor,
        numLicenciaInfractor: numLicencia,
        tipoVehiculo: tipoVehiculo,
        marcaVehiculo: marcaVehiculo,
        colorVehiculo: colorVehiculo,
        servicioVehiculo: servicioVehiculo,
      })

    })

  }
}
