import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgForm, FormGroup, FormBuilder, Validators
} from '@angular/forms';
import {
  Cargos
} from 'src/app/models/cargoPersonal/cargos';
import {
  ServiciosService
} from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { timeout } from 'q';

@Component({
  selector: 'app-add-cargo',
  templateUrl: './add-cargo.component.html',
  styleUrls: ['./add-cargo.component.css']
})
export class AddCargoComponent implements OnInit {

  validando: FormGroup

  constructor(public servicioServices: ServiciosService, public notificaciones:NotificationsService,public builder:FormBuilder)
     {
       this.validando = this.builder.group({
        cargo: ['', Validators.required],
        $key: [],
        busqueda: []
       })
     }

  ngOnInit() {
    this.servicioServices.getCargo();
    this.resetForm();
  }



  agregarCargo(cargo) {
      if (cargo.value.$key == null){
        this.servicioServices.insertCargos(cargo.value)
        this.notificaciones.success('Exitosamente','Cargo guardado correctamente',
        {
          timeOut:3000,
          showProgressBar:true
        })
      }
      else{
        this.servicioServices.updateCargos(cargo.value)
        this.notificaciones.success('Exitosamente','Cargo actualizado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
      }
      this.resetForm(cargo)
  }

  resetForm(cargo ? : NgForm) {
    if (cargo != null) {
      cargo.reset();
      this.servicioServices.seleccionarCargo = new Cargos();
    }
  }

}
