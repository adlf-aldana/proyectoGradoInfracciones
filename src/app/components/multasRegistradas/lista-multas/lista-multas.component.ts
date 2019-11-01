import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Boleta } from 'src/app/models/boletaInfraccion/boleta';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import * as firebase from 'firebase/app'
import { FirebaseStorage } from '@angular/fire';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-lista-multas',
  templateUrl: './lista-multas.component.html',
  styleUrls: ['./lista-multas.component.css']
})
export class ListaMultasComponent implements OnInit {

  listaMultas: Boleta[]

  // displayedColumns: string[] = ['placa','nombreInfractor','apPaterno', 'apMaterno','numLicencia','art','num','evento'];
  displayedColumns: string[] = ['fecha','placa', 'nombreInfractor', 'apPaterno', 'apMaterno', 'numLicencia', 'art', 'num', 'fotos'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public servicioServices: ServiciosService,
    public notificaciones: NotificationsService,
    public storageRef: AngularFireStorage
  ) { 
  }

  dataSource = new MatTableDataSource(this.listaMultas)

  ngOnInit() {
    this.servicioServices.getInfracciones()
      .snapshotChanges()
      .subscribe(item => {
        this.listaMultas = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.listaMultas.push(x as Boleta);
          this.dataSource = new MatTableDataSource(this.listaMultas)
          this.dataSource.paginator = this.paginator;

        })
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(sv: Boleta) {
    this.servicioServices.seleccionarInfraccion = Object.assign({}, sv)
  }

  onDelete($key: string) {
    if (confirm('¿Esta seguro de querer eliminarlo?')) {
      this.servicioServices.deleteInfraccion($key);
      this.notificaciones.success('Exitosamente', 'Marca eliminado correctamente',
        {
          timeOut: 3000,
          showProgressBar: true
        })
    }
  }

  myimg1
  myimg2
  expression=false
  verNombreFoto1
  verNombreFoto2
  
  verFotos(multas : Boleta)
  {
    this.expression=true
    this.verNombreFoto1 = multas.foto1
    this.verNombreFoto2 = multas.foto2

    // let verNombreFoto1 = multas.foto1
    // let verNombreFoto2 = multas.foto2

    // let link;

    // var storage = firebase.storage();
    // var pathReference = storage.ref();  

    // pathReference.child('infracciones/'+verNombreFoto1).getDownloadURL().then( url=> this.myimg1 = url);
    // pathReference.child('infracciones/'+verNombreFoto2).getDownloadURL().then( url=> this.myimg2 = url);

  }

}
