import {
  Component,
  OnInit
} from '@angular/core';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  Personal
} from 'src/app/models/personalTransito/personal';
import {
  NotificationsService
} from 'angular2-notifications';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import * as firebase from 'firebase/app'
import {
  AngularFireDatabase
} from 'angularfire2/database';
import {
  Cargos
} from 'src/app/models/cargoPersonal/cargos';

@Component({
  selector: 'app-add-personal-transito',
  templateUrl: './add-personal-transito.component.html',
  styleUrls: ['./add-personal-transito.component.css']
})
export class AddPersonalTransitoComponent implements OnInit {


  personalTransito: FormGroup

  get nombrePersonal() {
    return this.personalTransito.get('nombrePersonal')
  }
  get apPaternoPersonal() {
    return this.personalTransito.get('apPaternoPersonal')
  }
  get apMaternoPersonal() {
    return this.personalTransito.get('apMaternoPersonal')
  }
  get ciPersonal() {
    return this.personalTransito.get('ciPersonal')
  }
  get cargoPersonal() {
    return this.personalTransito.get('cargoPersonal')
  }
  get sexoPersonal() {
    return this.personalTransito.get('sexoPersonal')
  }
  get celularPersonal() {
    return this.personalTransito.get('celularPersonal')
  }
  get fechaNacimientoPersonal() {
    return this.personalTransito.get('fechaNacimientoPersonal')
  }
  get direccionPersonal() {
    return this.personalTransito.get('direccionPersonal')
  }

  num: any = /^(?:\+|-)?\d+$/;
  cargo: any
  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    db: AngularFireDatabase) {
    this.personalTransito = this.builder.group({
      $key: [],
      nombrePersonal: ['', Validators.required],
      apPaternoPersonal: ['', Validators.required],
      apMaternoPersonal: ['', Validators.required],
      ciPersonal: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(7)]],
      sexoPersonal: ['', Validators.required],
      // celularPersonal: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(this.num)]],
      celularPersonal: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(this.num)]],
      fechaNacimientoPersonal: ['', Validators.required],
      direccionPersonal: ['', ]
    })

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
    this.servicioServices.getPersonal();
    this.resetForm();
  }

  addPersonalTransito(servicioPersonalTransito: NgForm) {
    if (servicioPersonalTransito.valid) {
      if (servicioPersonalTransito.value.$key == null) {
        this.servicioServices.insertPersonal(servicioPersonalTransito.value)
        this.notificaciones.success('Exitosamente', 'Datos guardados correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        this.servicioServices.updatePersonal(servicioPersonalTransito.value)
        this.notificaciones.success('Exitosamente', 'Datos actualizados correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      this.resetForm(servicioPersonalTransito)
    } else {
      console.log('Error no valido');

    }
  }

  resetForm(servicioPersonalTransito ? : NgForm) {
    if (servicioPersonalTransito != null) {
      servicioPersonalTransito.reset();
      this.servicioServices.seleccionarPersonal = new Personal();
    }
  }
}
