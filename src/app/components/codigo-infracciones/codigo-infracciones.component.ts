import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { CodigoTransito } from 'src/app/models/codigoTransito/codigo-transito';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-codigo-infracciones',
  templateUrl: './codigo-infracciones.component.html',
  styleUrls: ['./codigo-infracciones.component.css']
})
export class CodigoInfraccionesComponent implements OnInit {

  codigosTransito: CodigoTransito[]
  displayedColumns: string[] = [
    'articulo',
  'numero',
'descripcion'];

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;


  constructor(
    db: AngularFireDatabase
  ) {
    db.list('codigosTransito').snapshotChanges()
      .subscribe(item=>{
        this.codigosTransito=[];
        item.forEach(element=>{
          let x= element.payload.toJSON();
          x["$key"]=element.key;
          this.codigosTransito.push(x as CodigoTransito);
          this.dataSource = new MatTableDataSource(this.codigosTransito);
        this.dataSource.paginator = this.paginator;
        })
      })
   }

   dataSource = new MatTableDataSource(this.codigosTransito);

   applyFilter(filterValue: string)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnInit() {
  }

}
