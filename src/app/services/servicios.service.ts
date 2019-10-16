import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Cargos } from '../models/cargoPersonal/cargos';
import { Boleta } from '../models/boletaInfraccion/boleta';
import { Tipo } from '../models/tipoServicioVehiculo/tipo';
import { CodigoTransito } from '../models/codigoTransito/codigo-transito';
import { Personal } from '../models/personalTransito/personal';
import { TipoVehiculo } from '../models/tipoVehiculo/tipo-vehiculo';
import { MarcaVehiculos } from '../models/marcaVehiculos/marca-vehiculos';
import { ColorVehiculos } from '../models/colorVehiculos/color-vehiculos';
import { Infractor } from '../models/Infractor/infractor';
import { DatosVehiculo } from '../models/datosVehiculo/datos-vehiculo';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  seleccionarInfraccion: Boleta = new Boleta();
  seleccionarServicioVehicular: Tipo = new Tipo();
  seleccionarCodigoTransito: CodigoTransito = new CodigoTransito();
  seleccionarCargo: Cargos = new Cargos();
  seleccionarPersonal: Personal = new Personal();
  seleccionarTipoVehiculo: TipoVehiculo = new TipoVehiculo();
  seleccionarMarcaVehiculo: MarcaVehiculos = new MarcaVehiculos();
  seleccionarColorVehiculo: ColorVehiculos= new ColorVehiculos();
  seleccionarInfractor: Infractor = new Infractor();
  seleccionarDatosVehiculo: DatosVehiculo = new DatosVehiculo();

  listaInfracciones: AngularFireList < any > ;
  listaServiciosVehiculares: AngularFireList < any > ;
  listaCodigoTransito: AngularFireList < any > ;
  listaCargos: AngularFireList < any > ;
  listaPersonal: AngularFireList <any>;
  listaTipoVehiculo: AngularFireList<any>;
  listaMarcaVehiculo: AngularFireList<any>;
  listaColorVehiculo: AngularFireList<any>;
  listaInfractor: AngularFireList<any>;
  listDatosVehiculo: AngularFireList<any>;


  constructor(private firebase: AngularFireDatabase) { }

  getDatosVehiculo() {
    return this.listDatosVehiculo = this.firebase.list('datosVehiculo');
  }
  insertDatosVehiculo(datosVehiculo: DatosVehiculo) {
    this.listDatosVehiculo.push({
      tipoVehiculo: datosVehiculo.tipo,
      marcaVehiculo: datosVehiculo.marca,
      colorVehiculo: datosVehiculo.color,
      placa: datosVehiculo.placa
    })
  }
  updateDatosVehiculo(datosVehiculo: DatosVehiculo) {
    this.listDatosVehiculo.update(datosVehiculo.$key, {
      tipoVehiculo: datosVehiculo.tipo,
      marcaVehiculo: datosVehiculo.marca,
      colorVehiculo: datosVehiculo.color,
      placa: datosVehiculo.placa
    })
  }
  deleteDatosVehiculo($key: string) {
    this.listDatosVehiculo.remove($key);
  }

  getInfractor() {
    return this.listaInfractor = this.firebase.list('infractor');
  }
  insertInfractor(infractor: Infractor) {
    this.listaInfractor.push({
      licenciaInfractor: infractor.licenciaInfractor,
      nombreInfractor: infractor.nombreInfractor,
      apPaternoInfractor: infractor.apPaternoInfractor,
      apMaternoInfractor: infractor.apMaternoInfractor,
      sexoInfractor: infractor.sexoInfractor,
      fechaNacimientoInfractor: infractor.fechaNacimientoInfractor,
      celularInfractor: infractor.celularInfractor,
      direccionInfractor: infractor.direccionInfractor,
    })
  }
  updateInfractor(infractor: Infractor) {
    this.listaInfractor.update(infractor.$key, {
      nombreInfractor: infractor.nombreInfractor,
      apPaternoInfractor: infractor.apPaternoInfractor,
      apMaternoInfractor: infractor.apMaternoInfractor,
      sexoInfractor: infractor.sexoInfractor,
      fechaNacimientoInfractor: infractor.fechaNacimientoInfractor,
      celularInfractor: infractor.celularInfractor,
      direccionInfractor: infractor.direccionInfractor,
      licenciaInfractor: infractor.licenciaInfractor
    })
  }
  deleteInfractor($key: string) {
    this.listaInfractor.remove($key);
  }

  getColorVehiculo() {
    return this.listaColorVehiculo = this.firebase.list('colorVehiculos');
  }
  insertColorVehiculo(colorVehiculo: ColorVehiculos) {
    this.listaColorVehiculo.push({
      nombreColorVehiculo: colorVehiculo.nombreColorVehiculo
    })
  }
  updateColorVehiculo(colorVehiculo: ColorVehiculos) {
    this.listaColorVehiculo.update(colorVehiculo.$key, {
      nombreColorVehiculo: colorVehiculo.nombreColorVehiculo
    })
  }
  deleteColorVehiculo($key: string) {
    this.listaColorVehiculo.remove($key);
  }

  getMarcaVehiculo() {
    return this.listaMarcaVehiculo = this.firebase.list('marcaVehiculos');
  }
  insertMarcaVehiculo(marcaVehiculo: MarcaVehiculos) {
    
    this.listaMarcaVehiculo.push({
      nombreMarcaVehiculos: marcaVehiculo.nombreMarcaVehiculos
    })
  }
  updateMarcaVehiculo(marcaVehiculo: MarcaVehiculos) {
    this.listaMarcaVehiculo.update(marcaVehiculo.$key, {
      nombreMarcaVehiculos: marcaVehiculo.nombreMarcaVehiculos
    })
  }
  deleteMarcaVehiculo($key: string) {
    this.listaMarcaVehiculo.remove($key);
  }


  getTipoVehiculo() {
    return this.listaTipoVehiculo = this.firebase.list('tipoVehiculos');
  }
  insertTipoVehiculo(tipoVehiculo: TipoVehiculo) {
    this.listaTipoVehiculo.push({
      nombreTipoVehiculo: tipoVehiculo.nombreTipoVehiculo
    })
  }
  updateTipoVehiculo(tipoVehiculo: TipoVehiculo) {
    this.listaTipoVehiculo.update(tipoVehiculo.$key, {
      nombreTipoVehiculo: tipoVehiculo.nombreTipoVehiculo
    })
  }
  deleteTipoVehiculo($key: string) {
    this.listaTipoVehiculo.remove($key);
  }


  getPersonal() {
    return this.listaPersonal = this.firebase.list('personalTransito');
  }
  insertPersonal(personalTransito: Personal) {
    this.listaPersonal.push({
      nombrePersonal: personalTransito.nombrePersonal,
      apPaternoPersonal: personalTransito.apPaternoPersonal,
      apMaternoPersonal: personalTransito.apMaternoPersonal,
      ciPersonal: personalTransito.ciPersonal,
      sexoPersonal: personalTransito.sexoPersonal,
      fechaNacimientoPersonal: personalTransito.fechaNacimientoPersonal,
      celularPersonal: personalTransito.celularPersonal,
      direccionPersonal: personalTransito.direccionPersonal
    })
  }
  updatePersonal(personalTransito: Personal) {
    this.listaPersonal.update(personalTransito.$key, {
      nombrePersonal: personalTransito.nombrePersonal,
      apPaternoPersonal: personalTransito.apPaternoPersonal,
      apMaternoPersonal: personalTransito.apMaternoPersonal,
      ciPersonal: personalTransito.ciPersonal,
      sexoPersonal: personalTransito.sexoPersonal,
      fechaNacimientoPersonal: personalTransito.fechaNacimientoPersonal,
      celularPersonal: personalTransito.celularPersonal,
      direccionPersonal: personalTransito.direccionPersonal
    })
  }
  deletePersonal($key: string) {
    this.listaPersonal.remove($key);
  }


  getCargo() {
    return this.listaCargos = this.firebase.list('cargosTransito');
  }
  insertCargos(cargoTransito: Cargos) {
    this.listaCargos.push({
      cargo: cargoTransito.cargo
    })
  }
  updateCargos(cargoTransito: Cargos) {
    this.listaCargos.update(cargoTransito.$key, {
      cargo: cargoTransito.cargo
    })
  }
  deleteCargos($key: string) {
    this.listaCargos.remove($key);
  }


  getCodigoTransito() {
    return this.listaCodigoTransito = this.firebase.list('codigosTransito');
  }
  insertCodigosTransito(codigoTransito: CodigoTransito) {
    this.listaCodigoTransito.push({
      articulo: codigoTransito.articulo,
      numero: codigoTransito.numero,
      descripcion: codigoTransito.descripcion
    })
  }
  updateCodigosTransito(codigoTransito: CodigoTransito) {
    this.listaCodigoTransito.update(codigoTransito.$key, {
      articulo: codigoTransito.articulo,
      numero: codigoTransito.numero,
      descripcion: codigoTransito.descripcion
    })
  }
  deleteCodigoTransito($key: string) {
    this.listaCodigoTransito.remove($key);
  }


  getServiciosVehiculares() {
    return this.listaServiciosVehiculares = this.firebase.list('serviciosVehiculares');
  }
  insertTipoServicioVehicular(tsv: Tipo) {
    console.log(this.listaServiciosVehiculares);
    this.listaServiciosVehiculares.push({
      nombreTipoServicio: tsv.nombreTipoServicio
    })
  }
  updateTipoServicioVehicular(tsv: Tipo) {
    this.listaServiciosVehiculares.update(tsv.$key, {
      nombreTipoServicio: tsv.nombreTipoServicio
    })
  }
  deleteTipoServicioVehicular($key: string) {
    this.listaServiciosVehiculares.remove($key);
  }


  getInfracciones() {
    return this.listaInfracciones = this.firebase.list('boletaInfraccion');
  }
  insertInfracciones(datosInfracciones: Boleta) {
      this.listaInfracciones.push({
        numLicencia: datosInfracciones.numLicencia,
        placa: datosInfracciones.placa,
        ciPolicia: datosInfracciones.ciPolicia
    })
  }
  updateInfraccion(datosInfracciones: Boleta) {
    // this.listaInfracciones.update(datosInfracciones.$key, {
    //   numLicencia: datosInfracciones.numLicencia,
    //   placa: datosInfracciones.placa,
    //   // lugarInfraccion: datosInfracciones.lugarInfraccion,
    //   // observacionInfraccion: datosInfracciones.observacionInfraccion,
    //   ciPolicia: datosInfracciones.ciPolicia,
    // })
  }
  deleteInfraccion($key: string) {
    this.listaInfracciones.remove($key);
  }

  formatDate(date: Date): string{
    const day = date.getDate();
    var dia;
    if(day<9)
      dia = ("0"+day).toString();
    else
      dia = day
    
    var month = date.getMonth()+1;
    var mes;
    if(month<=9)
      mes = ("0"+month).toString();
    else
      mes = month

    
    const year = date.getFullYear();
    return (mes+"-"+dia+"-"+year);
  }

}