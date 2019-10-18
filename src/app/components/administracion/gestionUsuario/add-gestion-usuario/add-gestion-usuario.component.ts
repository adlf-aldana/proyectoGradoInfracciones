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

@Component({
  selector: 'app-add-gestion-usuario',
  templateUrl: './add-gestion-usuario.component.html',
  styleUrls: ['./add-gestion-usuario.component.css']
})
export class AddGestionUsuarioComponent implements OnInit {
  registro: FormGroup
  get f() {
    return this.registro.controls;
  }
  cargo: any
  submitted = false;

  constructor(public formBuilder: FormBuilder,
    db: AngularFireDatabase,
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService) {

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
      nombreUsuario: [],
      cargoUsuario: [],
      ciUsuario: [],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: confirmandoPassword('password', 'confirmPassword')
    });
  }

  buscarPersonal() {
    let ciPersonal: string = (document.getElementById('ciUsuario') as HTMLInputElement).value;

    var ref = firebase.database().ref('personalTransito');
    ref.orderByChild('ciPersonal').equalTo(ciPersonal).on("child_added", snap => {

      let nombrePersonal = snap.val().nombrePersonal;
      document.getElementById('nombrePersonal').innerHTML = nombrePersonal;

      let apPaternoPersonal = snap.val().apPaternoPersonal;
      document.getElementById('apPaternoPersonal').innerHTML = apPaternoPersonal;

      let apMaternoPersonal = snap.val().apMaternoPersonal;
      document.getElementById('apMaternoPersonal').innerHTML = apMaternoPersonal;
    })
  }

  addUsuario(servicioUsuario: NgForm) {
    if (servicioUsuario.valid) {
      if (servicioUsuario.value.$key == null) {
        this.servicioServices.insertUsuario(servicioUsuario.value)
        this.notificaciones.success('Exitosamente', 'Datos guardados correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        this.servicioServices.updateUsuario(servicioUsuario.value)
        this.notificaciones.success('Exitosamente', 'Datos actualizados correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      this.resetForm(servicioUsuario)
    } else {
      console.log('Error no valido');
    }
  }

  resetForm(servicioUsuario ? : NgForm) {
    if (servicioUsuario != null) {
      servicioUsuario.reset();
      this.servicioServices.seleccionarUsuario = new GestionUsuario();
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
