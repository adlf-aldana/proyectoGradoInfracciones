import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CodigoTransito } from 'src/app/models/codigoTransito/codigo-transito';
import { NotificationsService } from 'angular2-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-list-codigo-transito',
  templateUrl: './list-codigo-transito.component.html',
  styleUrls: ['./list-codigo-transito.component.css']
})

export class ListCodigoTransitoComponent implements OnInit {
listaCodigos: CodigoTransito[];

displayedColumns: string[] = ['articulo','numero','descripcion','evento'];

@ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notificacion: NotificationsService
    ) { }

    dataSource = new MatTableDataSource(this.listaCodigos)


  ngOnInit() {
    this.servicioServices.getCodigoTransito()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaCodigos=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaCodigos.push(x as CodigoTransito)
        this.dataSource = new MatTableDataSource(this.listaCodigos)
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(codigoTransito: CodigoTransito){
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
