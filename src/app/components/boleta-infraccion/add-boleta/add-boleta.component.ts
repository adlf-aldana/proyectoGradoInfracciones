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
  NgForm
} from '@angular/forms';
import {
  AngularFireDatabase
} from 'angularfire2/database';
import * as firebase from 'firebase/app'
import {
  equal,
  strictEqual
} from 'assert';
import { Boleta } from 'src/app/models/boletaInfraccion/boleta';
import * as jsPDF from 'jspdf'



@Component({
  selector: 'app-add-boleta',
  templateUrl: './add-boleta.component.html',
  styleUrls: ['./add-boleta.component.css']
})


export class AddBoletaComponent implements OnInit { 
  datosBoleta: FormGroup

  lat: number = -19.0397905;
  lng: number = -65.2571159;
  
  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private firebase: AngularFireDatabase
    ) {
      this.datosBoleta = this.builder.group({
        $key: [],
        numLicencia: [],
        placa:[],
        ciPolicia: [],
        // latlng:[{value: this.lat +", "+ this.lng}]
      })
  }


  ngOnInit() {
    this.servicioServices.getInfracciones();
    this.resetForm()
  }

  addBoleta(datosBoleta: NgForm) {
    this.servicioServices.insertInfracciones(datosBoleta.value)
      if (datosBoleta.value.$key == null){
      this.notificaciones.success('Exitosamente','Item guardado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    else
    {
      this.servicioServices.updateInfraccion(datosBoleta.value)
      this.notificaciones.success('Exitosamente','Item actualizado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    this.resetForm(datosBoleta)
  }

  resetForm(serviciBoleta ? : NgForm) {
    if (serviciBoleta != null) {
      serviciBoleta.reset();
      this.servicioServices.seleccionarInfraccion = new Boleta();
    }
  }

  nuevoInfractor(){}

  
  generarPDF()
  {
    // let licencia: number = 7485588;
    let licencia = (document.getElementById('numLicencia') as HTMLInputElement).value;
    let placa = (document.getElementById('placa') as HTMLInputElement).value;
    
    const doc = new jsPDF('p','mm',[279, 120])//('p','mm',[297, 210]);
    
    doc.setFontSize(5);
    doc.text(5.4, 6, 'ESTADO PLURINACIONAL DE BOLIVIA');
    doc.setFontSize(9);
    doc.text(5, 10, 'BOLETA INFRACCION');

    doc.setFontSize(5);
    doc.text(11, 15, 'Fecha y Hora:');
    
    doc.setFontSize(5);
    doc.text(3, 20, 'Placa N° '+placa);
    
    doc.setFontSize(5);
    doc.text(22, 20, 'Licencia N° '+licencia);


    let nameInfractor = "";
    let apPatInfractor = "";
    let apMatInfractor = "";
    let licenciaInfractor = "";

    let name;

    let infractor: string = (document.getElementById('numLicencia') as HTMLInputElement).value;

    firebase.database().ref('infractor').once('value').then(function (snapshot) {
      let nuevo = Object.keys(snapshot.val())

      for (let i = 0; i < nuevo.length; i++) {
        firebase.database().ref('infractor/' + nuevo[i]).once('value').then(function (snapshot) {
          let ci = snapshot.child('licenciaInfractor').val()

          if (infractor === ci) {

            nameInfractor = snapshot.child('nombreInfractor').val()

            apPatInfractor = snapshot.child('apPaternoInfractor').val()

            apMatInfractor = snapshot.child('apMaternoInfractor').val()

            doc.setFontSize(5);
            doc.text(3, 24, 'Nombre del Conductor: '+nameInfractor+" "+apPatInfractor+" "+apMatInfractor);
            doc.autoPrint();
            doc.save('multa.pdf');
          }
          
        });
      }
    });
    
    
    
    
    
    
    
    
    // doc.setFontsize(12);
    // doc.text('BOLETA INFRACCION',3,3);


    
  }


  valorLicencia;
  comprobarInfractor(ciInfrac ?: string) {
    let nameInfractor = "";
    let apPatInfractor = "";
    let apMatInfractor = "";
    let licenciaInfractor = "";

    let name;

    // document.getElementById('nombreInfractor').innerHTML = ""
    // document.getElementById('apPaternoInfractor').innerHTML = ""
    // document.getElementById('apMaternoInfractor').innerHTML = ""
    // document.getElementById('licenciaInfractor').innerHTML = ""

    let infractor: string = (document.getElementById('numLicencia') as HTMLInputElement).value;
    

    firebase.database().ref('infractor').once('value').then(function (snapshot) {
      let nuevo = Object.keys(snapshot.val())

      for (let i = 0; i < nuevo.length; i++) {
        firebase.database().ref('infractor/' + nuevo[i]).once('value').then(function (snapshot) {
          let ci = snapshot.child('licenciaInfractor').val()

          if (infractor === ci) {

            nameInfractor = snapshot.child('nombreInfractor').val()
            name = document.getElementById('nombreInfractor').innerHTML = nameInfractor

            apPatInfractor = snapshot.child('apPaternoInfractor').val()
            document.getElementById('apPaternoInfractor').innerHTML = apPatInfractor

            apMatInfractor = snapshot.child('apMaternoInfractor').val()
            document.getElementById('apMaternoInfractor').innerHTML = apMatInfractor
            
            document.getElementById('licenciaInfractor').innerHTML = infractor;
            // licenciaInfractor = snapshot.child('licenciaInfractor').val()
          }
          
        });
      }
    });
    
    this.valorLicencia = (document.getElementById('numLicencia') as HTMLInputElement).value;
    // if (strictEqual(nameInfractor.toString())) {console.log('crear nuevo infractor');}
  }

  valorVehiculo;
  comprobarVehiculo()
  {
    let tiposVehiculos = "";
    let marcasVehiculos = "";
    let colorVehiculo = "";
    let placa = "";

    let name;

    // document.getElementById('tipoVehiculo').innerHTML = ""
    // document.getElementById('marcaVehiculo').innerHTML = ""
    // document.getElementById('colorVehiculo').innerHTML = ""
    // document.getElementById('placa').innerHTML = ""

    let numPlaca: string = (document.getElementById('placa') as HTMLInputElement).value;

    firebase.database().ref('datosVehiculo').once('value').then(function (snapshot) {
      let nuevo = Object.keys(snapshot.val())

      for (let i = 0; i < nuevo.length; i++) {
        firebase.database().ref('datosVehiculo/' + nuevo[i]).once('value').then(function (snapshot) {
          let ci = snapshot.child('placa').val()

          if (numPlaca === ci) {

            tiposVehiculos = snapshot.child('tipoVehiculo').val()
            name = document.getElementById('tipoVehiculo').innerHTML = tiposVehiculos

            marcasVehiculos = snapshot.child('marcaVehiculo').val()
            document.getElementById('marcaVehiculo').innerHTML = marcasVehiculos

            colorVehiculo = snapshot.child('colorVehiculo').val()
            document.getElementById('colorVehiculo').innerHTML = colorVehiculo
            
            document.getElementById('placa').innerHTML = numPlaca;
            // licenciaInfractor = snapshot.child('licenciaInfractor').val()
          }
          
        });
      }
    });
    
    this.valorVehiculo = (document.getElementById('placa') as HTMLInputElement).value;
  }




  valorPolicia;
  comprobarPolicia()
  {
    let nombrePersonal = "";
    let apPaternoPersonal = "";
    let apMaternoPersonal = "";
    let ciPersonal = "";

    let name;

    // document.getElementById('nombrePersonal').innerHTML = ""
    // document.getElementById('apPaternoPersonal').innerHTML = ""
    // document.getElementById('apMaternoInfractor').innerHTML = ""
    // document.getElementById('cedulaIdentidad').innerHTML = ""

    let cedulaIdentidad: string = (document.getElementById('ciPolicia') as HTMLInputElement).value;

    firebase.database().ref('personalTransito').once('value').then(function (snapshot) {
      let nuevo = Object.keys(snapshot.val())

      for (let i = 0; i < nuevo.length; i++) {
        firebase.database().ref('personalTransito/' + nuevo[i]).once('value').then(function (snapshot) {
          let ci = snapshot.child('ciPersonal').val()

          if (cedulaIdentidad === ci) {

            nombrePersonal = snapshot.child('nombrePersonal').val()
            name = document.getElementById('nombrePersonal').innerHTML = nombrePersonal

            apPaternoPersonal = snapshot.child('apPaternoPersonal').val()
            document.getElementById('apPaternoPersonal').innerHTML = apPaternoPersonal

            apMaternoPersonal = snapshot.child('apMaternoPersonal').val()
            document.getElementById('apMaternoPersonal').innerHTML = apMaternoPersonal
            
            document.getElementById('cedulaIdentidad').innerHTML = cedulaIdentidad;
            // licenciaInfractor = snapshot.child('licenciaInfractor').val()
          }
          
        });
      }
    });
    
    this.valorPolicia = (document.getElementById('ciPersonal') as HTMLInputElement).value;
  }
}
