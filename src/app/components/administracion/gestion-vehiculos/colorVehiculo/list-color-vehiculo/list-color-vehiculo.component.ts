import { Component, OnInit } from '@angular/core';
import { ColorVehiculos } from 'src/app/models/colorVehiculos/color-vehiculos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-color-vehiculo',
  templateUrl: './list-color-vehiculo.component.html',
  styleUrls: ['./list-color-vehiculo.component.css']
})
export class ListColorVehiculoComponent implements OnInit {

  listaColorVehiculos: ColorVehiculos[];


  constructor(public servicioServices:ServiciosService, public notificaciones:NotificationsService) { }


  ngOnInit() {
    this.servicioServices.getColorVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaColorVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaColorVehiculos.push(x as ColorVehiculos);
      })
    })
  }

  onEdit(sv: ColorVehiculos){
    this.servicioServices.seleccionarColorVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteColorVehiculo($key);
    this.notificaciones.success('Exitosamente','Color eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
  }

}