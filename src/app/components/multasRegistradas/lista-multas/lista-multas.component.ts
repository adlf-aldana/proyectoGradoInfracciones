import { Component, OnInit, ViewChild } from '@angular/core';
import { Boleta } from 'src/app/models/boletaInfraccion/boleta';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-lista-multas',
  templateUrl: './lista-multas.component.html',
  styleUrls: ['./lista-multas.component.css']
})
export class ListaMultasComponent implements OnInit {

  listaMultas: Boleta[]

  // displayedColumns: string[] = ['placa','nombreInfractor','apPaterno', 'apMaterno','numLicencia','art','num','evento'];
  displayedColumns: string[] = ['placa','nombreInfractor','apPaterno', 'apMaterno','numLicencia','art','num'];
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(
    public servicioServices:ServiciosService, 
    public notificaciones:NotificationsService
  ) { }

  dataSource = new MatTableDataSource(this.listaMultas)

  ngOnInit() {
    this.servicioServices.getInfracciones()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaMultas=[];
      item.forEach(element=>{
        let x = element.payload.toJSON();
        x["$key"]=element.key;
        this.listaMultas.push(x as Boleta);
        this.dataSource = new MatTableDataSource(this.listaMultas)
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(sv: Boleta){
    this.servicioServices.seleccionarInfraccion = Object.assign({},sv)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteInfraccion($key);
    this.notificaciones.success('Exitosamente','Marca eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar:true
        })
    }
  }

}
