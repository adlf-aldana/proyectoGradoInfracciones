import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import * as firebase from 'firebase/app'
import { AngularFireDatabase } from 'angularfire2/database';
import { Cargos } from 'src/app/models/cargoPersonal/cargos';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { GestionUsuario } from 'src/app/models/gestionarUsuarios/gestion-usuario';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-list-gestion-usuario',
  templateUrl: './list-gestion-usuario.component.html',
  styleUrls: ['./list-gestion-usuario.component.css']
})
export class ListGestionUsuarioComponent implements OnInit {

  listaUsuario: GestionUsuario[]

  displayedColumns: string[] = [
  'ciUsuario',
  'nombreUsuario',
  'cargoUsuario',
  // 'password',
  'evento'];

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;

  constructor(public servicioServices: ServiciosService,
    public notification:NotificationsService){
    }

    dataSource = new MatTableDataSource(this.listaUsuario);


  ngOnInit()
  {
    this.servicioServices.getUsuario()
    .snapshotChanges()
    .subscribe(item=>{
      this.listaUsuario=[];
      item.forEach(element=>{
        let x= element.payload.toJSON();
        x["$key"]=element.key;
        this.listaUsuario.push(x as GestionUsuario);
        this.dataSource = new MatTableDataSource(this.listaUsuario);
        this.dataSource.paginator = this.paginator;
      })
    })
  }

  applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onEdit(usuario: GestionUsuario){
    this.servicioServices.seleccionarUsuario = Object.assign({},usuario)
  }

  onDelete($key: string)
  {
    if(confirm('¿Esta seguro de querer eliminarlo?')){
    this.servicioServices.deleteUsuario($key);
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

