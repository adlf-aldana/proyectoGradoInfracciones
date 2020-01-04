import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Cargos
} from 'src/app/models/cargoPersonal/cargos';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  AuthService
} from 'src/app/services/auth.service'
import {
  NotificationsService
} from 'angular2-notifications';

import * as crypto from 'crypto-js';



import * as firebase from 'firebase/app'


@Component({
  selector: 'app-add-cargo',
  templateUrl: './add-cargo.component.html',
  styleUrls: ['./add-cargo.component.css']
})
export class AddCargoComponent implements OnInit {

  validando: FormGroup

  get cargo() {
    return this.validando.get('cargo')
  }

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    public authService: AuthService) {
    this.validando = this.builder.group({
      $key: [],
      cargo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],

    })
  }


  datosPersonal: {
    nombre;
    apPaterno;
    apMaterno;
    cedula;
    cargo;
  }
  ngOnInit() {
    this.servicioServices.getCargo();
    this.resetForm();
    this.obteniendoDatosPersonal()
  }

  obteniendoDatosPersonal(){
    let correo = this.authService.correo;
    
    var ref = firebase.database().ref('gestionUsuarios')
      var existe = false;

      ref.orderByChild('correoUsuario').equalTo(correo).on("child_added", snap => {
        existe = true;
      });
    
  }



  agregarCargo(cargo: NgForm) {

    var keySecret = "proyectoGradoUsfxTransito"
    if (cargo.valid) {
      var ref = firebase.database().ref('cargosTransito')
      var existe = false;

      ref.orderByChild('cargo').equalTo(this.servicioServices.seleccionarCargo.cargo).on("child_added", snap => {
        existe = true;
      });

      if (existe) {
        this.notificaciones.error('Error', 'El cargo ya existe', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      else {
        if (cargo.value.$key == null) {
          this.servicioServices.insertCargos(cargo.value)
          this.notificaciones.success('Exitosamente', 'Cargo guardado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })

          let date = new Date()
          let fechaInfraccion
          if ((date.getMonth() + 1) < 10)
            fechaInfraccion = date.getDate() + '/0' + (date.getMonth() + 1) + '/' + date.getFullYear()
          else
            fechaInfraccion = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()

          console.log(fechaInfraccion);



          // this.servicioServices.insertBitacora()
        } else {
          this.servicioServices.updateCargos(cargo.value)
          this.notificaciones.success('Exitosamente', 'Cargo actualizado correctamente', {
            timeOut: 3000,
            showProgressBar: true
          })
        }
        this.resetForm(cargo)
      }

    } else {
      this.servicioServices.updateCargos(cargo.value)
      this.notificaciones.success('Error', 'Cargo es un campo obligatorio', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
  }


  resetForm(cargo?: NgForm) {
    if (cargo != null) {
      cargo.reset();
      this.servicioServices.seleccionarCargo = new Cargos();
    }
  }

}


  // if (cargo.value.$key == null) {
  //   this.servicioServices.insertCargos(cargo.value)
  //   this.notificaciones.success('Exitosamente', 'Cargo guardado correctamente', {
  //     timeOut: 3000,
  //     showProgressBar: true
  //   })
  // } else {
  //   this.servicioServices.updateCargos(cargo.value)
  //   this.notificaciones.success('Exitosamente', 'Cargo actualizado correctamente', {
  //     timeOut: 3000,
  //     showProgressBar: true
  //   })
  // }
  // this.resetForm(cargo)
  // })
  // } else {
  // this.servicioServices.updateCargos(cargo.value)
  // this.notificaciones.success('Error', 'Cargo es un campo obligatorio', {
  // timeOut: 3000,
  // showProgressBar: true
  // }
