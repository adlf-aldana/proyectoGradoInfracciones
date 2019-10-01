import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CodigoTransito } from 'src/app/models/codigoTransito/codigo-transito';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-codigo-transito',
  templateUrl: './list-codigo-transito.component.html',
  styleUrls: ['./list-codigo-transito.component.css']
})
export class ListCodigoTransitoComponent implements OnInit {
listaCodigos: CodigoTransito[];

  constructor(public servicioServices: ServiciosService,public notificacion: NotificationsService) { }


  ngOnInit() {
    this.servicioServices.getCodigoTransito()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaCodigos=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaCodigos.push(x as CodigoTransito)
      })
    })
  }

  onEdit(codigoTransito: CodigoTransito){
    console.log(codigoTransito);
    
    this.servicioServices.seleccionarCodigoTransito = Object.assign({},codigoTransito)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteCodigoTransito($key);
    this.notificacion.success('Exitosamente','Item eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
  }
}
}
