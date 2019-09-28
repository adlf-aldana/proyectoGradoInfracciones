import { Component, OnInit } from '@angular/core';
import { Personal } from 'src/app/models/personalTransito/personal';
import { ServiciosService } from 'src/app/services/servicios.service';
// import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-personal-transito',
  templateUrl: './list-personal-transito.component.html',
  styleUrls: ['./list-personal-transito.component.css']
})
export class ListPersonalTransitoComponent implements OnInit {
  listaPersonal: Personal[];

  // constructor(public servicioServices: ServiciosService, public notification:NotificationsService) { }
  constructor(public servicioServices: ServiciosService) { }


  ngOnInit() {
    this.servicioServices.getPersonal()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaPersonal=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaPersonal.push(x as Personal)
      })
    })
  }

  onEdit(personalTransito: Personal){
    this.servicioServices.seleccionarPersonal = Object.assign({},personalTransito)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deletePersonal($key);
    // this.notification.success('¡Correcto!', 'El item fue eliminado correctamente', {
    //   timeOut: 3000,
    //   showProgressBar: true,
    //   pauseOnHover: true,
    //   clickToClose: true,
    //   show: true
    // });
    }
  }

}
