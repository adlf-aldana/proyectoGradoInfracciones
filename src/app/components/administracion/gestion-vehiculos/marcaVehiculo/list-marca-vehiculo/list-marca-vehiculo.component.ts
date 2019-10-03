import { Component, OnInit, ViewChild } from '@angular/core';
import { MarcaVehiculos } from 'src/app/models/marcaVehiculos/marca-vehiculos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-list-marca-vehiculo',
  templateUrl: './list-marca-vehiculo.component.html',
  styleUrls: ['./list-marca-vehiculo.component.css']
})
export class ListMarcaVehiculoComponent implements OnInit {

  listaMarcaVehiculos: MarcaVehiculos[];

  displayedColumns: string[] = ['marca','evento'];
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices:ServiciosService, 
    public notificaciones:NotificationsService
    ) { }

    dataSource = new MatTableDataSource(this.listaMarcaVehiculos)

  ngOnInit() {
    this.servicioServices.getMarcaVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaMarcaVehiculos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaMarcaVehiculos.push(x as MarcaVehiculos);
        this.dataSource = new MatTableDataSource(this.listaMarcaVehiculos)
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
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