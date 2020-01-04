import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Boleta } from 'src/app/models/boletaInfraccion/boleta';
import { MatPaginator, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import * as firebase from 'firebase/app'
import { FirebaseStorage } from '@angular/fire';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-lista-multas',
  templateUrl: './lista-multas.component.html',
  styleUrls: ['./lista-multas.component.css']
})
export class ListaMultasComponent implements OnInit {

  listaMultas: Boleta[]

  displayedColumns: string[] = ['fecha','placa', 'nombreInfractor', 'apPaterno', 'apMaterno', 'numLicencia', 'art', 'num', 'fotos','evento'];
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
          // console.log(x.base64Srt);
          this.dataSource = new MatTableDataSource(this.listaMultas)
          this.dataSource.paginator = this.paginator;

          // this.verNombreFoto1 = x.base64Srt
        })
      })


    //   var ref = firebase.database().ref('boletaInfraccion');
    // // ref.orderByChild('correoUsuario').equalTo(this.authService.correo).on("child_added", snap => {
    // ref.orderByChild('correoUsuario').equalTo('adolfo@gmail.com').on("child_added", snap => {

    // })
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
    this.verNombreFoto1 = multas.base64Srt
    console.log(multas.base64Srt);

    // // let verNombreFoto2 = multas.base64Srt

    // var storage = firebase.storage();
    // var pathReference = storage.ref();

    // pathReference.child('fotoMultas/'+multas.base64Srt).getDownloadURL().then( url=> this.myimg2 = url);
  }

  // events: string[] = [];

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   console.log(event.value);

  //   this.events.push(`${type}: ${event.value}`);
  // }

  fecha1 = new FormControl(new Date());
  fecha2
  picket2
  filtrarFechas(){
    console.log(this.fecha1);
    console.log(this.fecha2);

    console.log(this.picket2);
  }

  onChange(event: any, newDate: any): void{
    console.log(event.target.value);
  }

}
