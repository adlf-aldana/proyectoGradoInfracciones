import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoVehiculo } from 'src/app/models/tipoVehiculo/tipo-vehiculo';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-list-tipo-vehiculo',
  templateUrl: './list-tipo-vehiculo.component.html',
  styleUrls: ['./list-tipo-vehiculo.component.css']
})
export class ListTipoVehiculoComponent implements OnInit {

  listaTipoVehiculos: TipoVehiculo[];

  displayedColumns: string[] = ['tipo','evento']
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices:ServiciosService,
    public notificaciones: NotificationsService
    ) { }

    dataSource = new MatTableDataSource(this.listaTipoVehiculos)

  ngOnInit() {
    this.servicioServices.getTipoVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaTipoVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaTipoVehiculos.push(x as TipoVehiculo);
        this.dataSource = new MatTableDataSource(this.listaTipoVehiculos)
        this.dataSource.paginator = this.paginator
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(sv: TipoVehiculo){
    this.servicioServices.seleccionarTipoVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteTipoVehiculo($key);
    this.notificaciones.success('Exitosamente','Tipo de servicio eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
  }

}