import { Component, OnInit } from '@angular/core';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import { ServiciosService } from 'src/app/services/servicios.service';
// import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-tipo-vehiculo',
  templateUrl: './list-tipo-vehiculo.component.html',
  styleUrls: ['./list-tipo-vehiculo.component.css']
})
export class ListTipoVehiculoComponent implements OnInit {

  listaTipoVehiculos: TipoVehiculo[];
  // constructor(public servicioServices:ServiciosService, public notification: NotificationsService) { }
  constructor(public servicioServices:ServiciosService) { }

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaTipoVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaTipoVehiculos.push(x as TipoVehiculo);
      })
    })
  }

  onEdit(sv: TipoVehiculo){
    this.servicioServices.seleccionarTipoVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteTipoVehiculo($key);
    // this.notification.success('¡Correcto!', 'El item fue eliminado correctamente', {
    //   position: ['bottom','right'],
    //   timeOut: 3000,
    //   showProgressBar: true,
    //   pauseOnHover: true,
    //   clickToClose: true,
    //   show: true
    // });
    }
  }

}