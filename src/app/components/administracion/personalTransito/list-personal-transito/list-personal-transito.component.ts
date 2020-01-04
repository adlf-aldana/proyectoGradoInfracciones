import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal } from 'src/app/models/personalTransito/personal';
import { ServiciosService } from 'src/app/services/servicios.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-list-personal-transito',
  templateUrl: './list-personal-transito.component.html',
  styleUrls: ['./list-personal-transito.component.css'],
})
export class ListPersonalTransitoComponent implements OnInit {
  listaPersonal: Personal[];

  displayedColumns: string[] = [
    'nombrePersonal',
  'apPaternoPersonal',
  'apMaternoPersonal',
  'ciPersonal',
  'sexoPersonal',
  'celularPersonal',
  'fechaNacimientoPersonal',
  'direccionPersonal',
  'evento'];

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notification:NotificationsService) { }

    dataSource = new MatTableDataSource(this.listaPersonal);


  ngOnInit() {
    this.servicioServices.getPersonal()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaPersonal=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaPersonal.push(x as Personal);
        this.dataSource = new MatTableDataSource(this.listaPersonal);
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(personalTransito: Personal){
    this.servicioServices.seleccionarPersonal = Object.assign({},personalTransito)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deletePersonal($key);
    this.notification.success('¡Correcto!', 'El item fue eliminado correctamente', {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      show: true
    });
    }
  }

}
