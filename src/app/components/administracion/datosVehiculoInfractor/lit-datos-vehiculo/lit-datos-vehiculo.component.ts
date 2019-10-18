import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosVehiculo } from 'src/app/models/datosVehiculo/datos-vehiculo';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-lit-datos-vehiculo',
  templateUrl: './lit-datos-vehiculo.component.html',
  styleUrls: ['./lit-datos-vehiculo.component.css']
})
export class LitDatosVehiculoComponent implements OnInit {

  listaDatos: DatosVehiculo[];

  displayedColumns: string[] = [
    'placa',
  'nombreInfractor',
'apPaternoInfractor',
'apMaternoInfractor',
'numLicencia',];

  // placa: string
  //   tipo: string
  //   marca: string
  //   color: string

  //   nombreInfractor: string
  //   apPaternoInfractor: string
  //   apMaternoInfractor: string
  //   numLicencia: string
  //   sexoInfractor: string
  //   fechaNacimientoInfractor: string
  //   celularInfractor: string
  //   direccionInfractor: string

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices:ServiciosService, 
    public notificaciones:NotificationsService
  ) { }

  dataSource = new MatTableDataSource(this.listaDatos)

  ngOnInit() {
    this.servicioServices.getDatosVehiculo()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaDatos=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaDatos.push(x as DatosVehiculo);
        this.dataSource = new MatTableDataSource(this.listaDatos)
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(sv: DatosVehiculo){
    this.servicioServices.seleccionarDatosVehiculo = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteDatosVehiculo($key);
    this.notificaciones.success('Exitosamente','Marca eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
  }

}
