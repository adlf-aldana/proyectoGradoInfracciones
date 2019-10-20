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
  NotificationsService
} from 'angular2-notifications';
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
    public builder: FormBuilder) {
    this.validando = this.builder.group({
      $key: [],
      cargo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],

    })
  }

  ngOnInit() {
    this.servicioServices.getCargo();
    this.resetForm();
  }



  agregarCargo(cargo: NgForm) {
    
    if (cargo.valid) {
      if (cargo.value.$key == null) {
        this.servicioServices.insertCargos(cargo.value)
        this.notificaciones.success('Exitosamente', 'Cargo guardado correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      } else {
        this.servicioServices.updateCargos(cargo.value)
        this.notificaciones.success('Exitosamente', 'Cargo actualizado correctamente', {
          timeOut: 3000,
          showProgressBar: true
        })
      }
      this.resetForm(cargo)
    } else {
      this.servicioServices.updateCargos(cargo.value)
      this.notificaciones.success('Error', 'Cargo es un campo obligatorio', {
        timeOut: 3000,
        showProgressBar: true
      })
    }
  }


  resetForm(cargo ? : NgForm) {
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
