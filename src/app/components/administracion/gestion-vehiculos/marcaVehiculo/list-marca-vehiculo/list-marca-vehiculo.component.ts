import { Component, OnInit } from '@angular/core';
import { MarcaVehiculos } from 'src/app/models/marcaVehiculos/marca-vehiculos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-marca-vehiculo',
  templateUrl: './list-marca-vehiculo.component.html',
  styleUrls: ['./list-marca-vehiculo.component.css']
})
export class ListMarcaVehiculoComponent implements OnInit {

  listaMarcaVehiculos: MarcaVehiculos[];

  constructor(public servicioServices:ServiciosService, public notificaciones:NotificationsService) { }


  ngOnInit() {
    this.servicioServices.getMarcaVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaMarcaVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaMarcaVehiculos.push(x as MarcaVehiculos);
      })
    })
  }

  onEdit(sv: MarcaVehiculos){
    this.servicioServices.seleccionarMarcaVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteMarcaVehiculo($key);
    this.notificaciones.success('Exitosamente','Marca eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
  }

}