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

import {WebcamImage, WebcamInitError,WebcamUtil} from 'ngx-webcam'
import { Subject, Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';




@Component({
  selector: 'app-add-boleta',
  templateUrl: './add-boleta.component.html',
  styleUrls: ['./add-boleta.component.css']
})


export class AddBoletaComponent implements OnInit {

  uploadPercent: Observable<number>;
  // downloadURL: Observable<string>;


  datosBoleta: FormGroup

  lat: number;
  lng: number;

  //toggle webcam on/off
  // public showWebcam = false;
  // public allowCameraSwitch = true;
  // public multipleWebcamsAvailable = false;
  // public deviceId: string;
  // public videoOptions: MediaTrackConstraints = {
  //   width: {ideal : 1024},
  //   height: {ideal: 576}
  // }
  // public errors: WebcamInitError[] = [];  
  
  // latest snapshot
  // public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  // private trigger: Subject<void> = new Subject<void>();

  //switch to next / previous / specific webcam; true/false; forward/backwards, string: deviceId
  // private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  
  
  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private firebase: AngularFireDatabase,
    private storage: AngularFireStorage
    ) {
      this.datosBoleta = this.builder.group({
        $key: [],
        placa: [],
        art: [],
        num: [],
        lat: [''],
        lng:[],
        foto1: []
      });
    }
    
    // :
    //     if request.auth != null;

    file
    filePath
    uploadFile(event){
      this.file = event.target.files[0];
      this.filePath = 'foto1'
      

    //   const file = event.target.files[0];
      
    //  const filePath = 'foto1'
    // const task = this.storage.upload(filePath, file)

    // this.uploadPercent = task.percentageChanges();
  }
  
  
  ngOnInit() {
    // WebcamUtil.getAvailableVideoInputs().then((MediaDevices: MediaDeviceInfo[])=>{
    //   this.multipleWebcamsAvailable = MediaDevices && MediaDevices.length>1;
    // })
    this.getUserLocation()
    this.servicioServices.getInfracciones();
    this.resetForm() 
  }

  // public triggerSnapshot(): void {
  //   this.trigger.next();
  // }

  // public toggleWebcam(): void{
  //   this.showWebcam = !this.showWebcam;
  // }

  // public handleInitError(error: WebcamInitError): void{
  //   this.errors.push(error);
  // }

  // public showNextWebcam(directionOrDeviceId: boolean|string): void{
  //   // true => move forward through devices
  //   // false => move backwardsthrough devices
  //   // string => move to device with given deviceId
  //   this.nextWebcam.next(directionOrDeviceId)
  // }

  // public handleImage(webcamImage: WebcamImage): void{
  //   console.info('active device: '+this.deviceId)
  //   this.webcamImage = webcamImage;
  // }

  // public cameraWasSwitched(deviceId: string): void{
  //   console.log('active device: '+deviceId);
  //   this.deviceId = deviceId;
  // }

  // public get triggerObservable(): Observable<void>{
  //   return this.trigger.asObservable();
  // }

  // public get nextWebcamObservable(): Observable<boolean|string>{
  //   return this.nextWebcam.asObservable();
  // }


  
  public getUserLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position =>{
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }

  
  
  addBoleta(datosBoleta: NgForm) {
    
const task = this.storage.upload(this.filePath, this.file)
    
    /*

    this.datosBoleta.patchValue({
      lat: this.lat,
      lng: this.lng
    })
    
    if (datosBoleta.value.$key == null) {
      this.servicioServices.insertInfracciones(datosBoleta.value)
      this.notificaciones.success('Exitosamente', 'Item guardado correctamente', {
        timeOut: 3000,
        showProgressBar: true
      })
    } else {
      this.servicioServices.updateInfraccion(datosBoleta.value)
      this.notificaciones.success('Exitosamente', 'Item actualizado correctamente', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
    this.resetForm(datosBoleta)*/
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

      let nombreInfractor = snap.val().nombreInfractor;
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
      doc.text(3, 23, 'Infractor ' + nombreInfractor + ' ' + apPatInfractor + ' ' + apMatInfractor);

      doc.save('infraccion.pdf');
    })
  }

  validarCodigoInfraccion(){
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
      document.getElementById('nombreInfractor').innerHTML = nombreInfractor;

      let apPaternoInfractor = snap.val().apPaternoInfractor;
      document.getElementById('apPaternoInfractor').innerHTML = apPaternoInfractor;

      let apMaternoInfractor = snap.val().apMaternoInfractor;
      document.getElementById('apMaternoInfractor').innerHTML = apMaternoInfractor;

      let numLicencia = snap.val().numLicencia;
      document.getElementById('numLicencia').innerHTML = numLicencia;

      let tipoVehiculo = snap.val().tipoVehiculo;
      document.getElementById('tipoVehiculo').innerHTML = tipoVehiculo

      let marcaVehiculo = snap.val().marcaVehiculo;
      document.getElementById('marcaVehiculo').innerHTML = marcaVehiculo

      let colorVehiculo = snap.val().colorVehiculo;
      document.getElementById('colorVehiculo').innerHTML = colorVehiculo

    })


  }
}
