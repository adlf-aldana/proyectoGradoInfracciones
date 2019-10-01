import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NgForm } from '@angular/forms';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-add-tipo-vehiculo',
  templateUrl: './add-tipo-vehiculo.component.html',
  styleUrls: ['./add-tipo-vehiculo.component.css']
})
export class AddTipoVehiculoComponent implements OnInit {

  constructor(public servicioServices:ServiciosService,public notificaciones:NotificationsService) {}

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    this.resetForm()
  }

  agregarTipoVehiculo(tipoVehicular: NgForm) {
    if (tipoVehicular.value.$key == null){
      this.servicioServices.insertTipoVehiculo(tipoVehicular.value)
      this.notificaciones.success('Exitosamente','Tipo de servicio agregado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    else{
      this.servicioServices.updateTipoVehiculo(tipoVehicular.value)
      this.notificaciones.success('Exitosamente','Tipo de Servicio actualizado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
    this.resetForm(tipoVehicular)
  }

  resetForm(tipoVehicular ? : NgForm) {
    if (tipoVehicular != null) {
      tipoVehicular.reset();
      this.servicioServices.seleccionarTipoVehiculo = new TipoVehiculo();
    }
  }

}