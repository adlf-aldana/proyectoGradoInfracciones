import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm
} from '@angular/forms';
import {
  AngularFireDatabase
} from 'angularfire2/database';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NotificationsService
} from 'angular2-notifications';
import {
  Cargos
} from 'src/app/models/cargoPersonal/cargos';
import * as firebase from 'firebase/app'
import {
  GestionUsuario
} from 'src/app/models/gestionarUsuarios/gestion-usuario';
import {
  invalid
} from '@angular/compiler/src/render3/view/util';

import {
  AuthService
} from '../../../../services/auth.service';

@Component({
  selector: 'app-add-gestion-usuario',
  templateUrl: './add-gestion-usuario.component.html',
  styleUrls: ['./add-gestion-usuario.component.css']
})
export class AddGestionUsuarioComponent implements OnInit {

  registro: FormGroup
  isShow = true;
  // isDisabled = false

  get nombreUsuario() {
    return this.registro.get('nombreUsuario')
  }

  get cargoUsuario() {
    return this.registro.get('cargoUsuario')
  }

  get password() {
    return this.registro.get('password')
  }

  get confirmPassword() {
    return this.registro.get('confirmPassword')
  }

  get correoUsuario() {
    return this.registro.get('correoUsuario')
  }

  // get f() {
  //   return this.registro.controls;
  // }

  cargo: any
  submitted = false;

  constructor(public formBuilder: FormBuilder,
    db: AngularFireDatabase,
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public authService: AuthService) {

    db.list('cargosTransito').snapshotChanges()
      .subscribe(item => {
        this.cargo = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.cargo.push(x as Cargos);
        })
      })
  }

  ngOnInit() {
    this.servicioServices.getUsuario();
    this.resetForm();

    this.registro = this.formBuilder.group({
      $key: [],
      // nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      cargoUsuario: ['', Validators.required],
      ciUsuario: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: confirmandoPassword('password', 'confirmPassword')
    });
  }

  buscarPersonal() {

    let i = 0;

    let ciPersonal: string = (document.getElementById('ci') as HTMLInputElement).value;

    this.registro.patchValue({
      ciUsuario: ciPersonal
    })

    var ref = firebase.database().ref('personalTransito');

    if (ref.orderByChild('ciPersonal').equalTo(ciPersonal).on("child_added", snap => {


        this.isShow = !this.isShow;
        // this.isDisabled = true

        let nombrePersonal = snap.val().nombrePersonal;
        document.getElementById('nombrePersonal').innerHTML = nombrePersonal;

        let apPaternoPersonal = snap.val().apPaternoPersonal;
        document.getElementById('apPaternoPersonal').innerHTML = apPaternoPersonal;

        let apMaternoPersonal = snap.val().apMaternoPersonal;
        document.getElementById('apMaternoPersonal').innerHTML = apMaternoPersonal;
        i = 1;
      })) {
      if (i == 0) {
        this.notificaciones.error('Error', 'Carnet de Identidad no existente', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
    }
  }

  addUsuario(servicioUsuario: NgForm) {

    if (servicioUsuario.valid) {
      if (servicioUsuario.value.$key == null) {
        
        this.authService.registerUser(this.servicioServices.seleccionarUsuario.correoUsuario, this.servicioServices.seleccionarUsuario.password)
          .then(success => {
            this.servicioServices.insertUsuario(servicioUsuario.value)
            this.notificaciones.success('Exitosamente', 'Datos actualizados correctamente', {
              timeOut: 3000,
              showProgressBar: true
            })
            this.resetForm(servicioUsuario)

          }).catch(err => {
            this.notificaciones.error('Error', 'Ya hay un usuario usando ese correo electrónico', {
              timeOut: 3000,
              showProgressBar: true
            })

          })


      } else {
        this.servicioServices.updateUsuario(servicioUsuario.value)
        this.notificaciones.success('Exitosamente', 'Datos actualizados correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
        this.resetForm(servicioUsuario)
      }

      // this.resetForm(servicioUsuario)
      // this.isDisabled = true
    } else {
      this.notificaciones.error('Error', 'Datos no válidos', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
  }

  resetForm(servicioUsuario ? : NgForm) {
    if (servicioUsuario != null) {
      servicioUsuario.reset();
      this.servicioServices.seleccionarUsuario = new GestionUsuario();
      this.isShow = !this.isShow;
      (document.getElementById('ci') as HTMLInputElement).value = ''
      // this.isDisabled = true
    }
  }
}

export function confirmandoPassword(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({
        mustMatch: true
      });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
