import { Component, OnInit, ViewChild } from '@angular/core';
import { ColorVehiculos } from 'src/app/models/colorVehiculos/color-vehiculos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-list-color-vehiculo',
  templateUrl: './list-color-vehiculo.component.html',
  styleUrls: ['./list-color-vehiculo.component.css']
})
export class ListColorVehiculoComponent implements OnInit {

  listaColorVehiculos: ColorVehiculos[];

  displayedColumns: string[] = ['color','evento'];
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;


  constructor(
    public servicioServices:ServiciosService, 
    public notificaciones:NotificationsService
    ) { }

    dataSource = new MatTableDataSource(this.listaColorVehiculos)


  ngOnInit() {
    this.servicioServices.getColorVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaColorVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaColorVehiculos.push(x as ColorVehiculos);
        this.dataSource = new MatTableDataSource(this.listaColorVehiculos)
        this.dataSource.paginator=this.paginator
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
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