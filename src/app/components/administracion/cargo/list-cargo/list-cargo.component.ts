import { Component, OnInit } from '@angular/core';
import { Cargos } from 'src/app/models/cargoPersonal/cargos';
import { ServiciosService } from 'src/app/services/servicios.service';
// import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-cargo',
  templateUrl: './list-cargo.component.html',
  styleUrls: ['./list-cargo.component.css']
})
export class ListCargoComponent implements OnInit {

listaCargos: Cargos[];

  // constructor(public servicioServices:ServiciosService,public notificaciones: NotificationsService) { }
  constructor(public servicioServices:ServiciosService) { }


  ngOnInit() {
    this.servicioServices.getCodigoCargo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaCargos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaCargos.push(x as Cargos)
      })
    })
  }

  onEdit(cargo: Cargos){
    this.servicioServices.seleccionarCargo = Object.assign({},cargo)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteCargos($key);
    // this.notificaciones.success('¡Correcto!', 'El item fue eliminado correctamente', {
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
