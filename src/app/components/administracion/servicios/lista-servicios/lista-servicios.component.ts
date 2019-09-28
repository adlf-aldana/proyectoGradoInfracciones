import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { Tipo } from 'src/app/models/tipoServicioVehiculo/tipo';
// import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-lista-servicios',
  templateUrl: './lista-servicios.component.html',
  styleUrls: ['./lista-servicios.component.css']
})
export class ListaServiciosComponent implements OnInit {

  listaServicios: Tipo[];
  constructor(
    public serviciosServices: ServiciosService) {     }
    // public serviciosServices: ServiciosService, public notificacionServicios: NotificationsService) {     }


  ngOnInit() {
    this.serviciosServices.getServiciosVehiculares()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaServicios=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaServicios.push(x as Tipo);
      })
    })
  }

  onEdit(sv: Tipo){
    this.serviciosServices.seleccionarServicioVehicular = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.serviciosServices.deleteTipoServicioVehicular($key);
    // this.notificacionServicios.success('¡Correcto!', 'El item fue eliminado correctamente', {
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