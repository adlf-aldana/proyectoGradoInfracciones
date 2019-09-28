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

  listaInfracciones: AngularFireList < any > ;
  listaServiciosVehiculares: AngularFireList < any > ;
  listaCodigoTransito: AngularFireList < any > ;
  listaCargos: AngularFireList < any > ;
  listaPersonal: AngularFireList <any>;
  listaTipoVehiculo: AngularFireList<any>;
  listaMarcaVehiculo: AngularFireList<any>;
  listaColorVehiculo: AngularFireList<any>;


  constructor(private firebase: AngularFireDatabase) { }

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
      apPaternoConductor: personalTransito.apPaternoPersonal,
      apMaternoConductor: personalTransito.apMaternoPersonal,
      ciPersona: personalTransito.ciPersonal,
      sexoPersonal: personalTransito.sexoPersonal,
      fechaNacimientoPersonal: personalTransito.fechaNacimientoPersonal,
      celularPersonal: personalTransito.celularPersonal,
      direccionPersonal: personalTransito.direccionPersonal
    })
  }
  deletePersonal($key: string) {
    this.listaPersonal.remove($key);
  }


  getCodigoCargo() {
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
      codigo: codigoTransito.codigo,
      descripcion: codigoTransito.descripcion
    })
  }
  updateCodigosTransito(codigoTransito: CodigoTransito) {
    this.listaCodigoTransito.update(codigoTransito.$key, {
      codigo: codigoTransito.codigo,
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
    return this.listaInfracciones = this.firebase.list('infracciones');
  }
  insertInfracciones(datosInfracciones: Boleta, fechaHora) {

    this.listaInfracciones.push({
      fechaHora: fechaHora,
      nombreConductor: datosInfracciones.nombreConductor,
      apPaternoConductor: datosInfracciones.apPaternoConductor,
      apMaternoConductor: datosInfracciones.apMaternoConductor,
      placa: datosInfracciones.placa,
      licenciaNum: datosInfracciones.licenciaNum,
      lugarInfraccion: datosInfracciones.lugarInfraccion,
      observacionInfraccion: datosInfracciones.observacionInfraccion,
      nombrePolicia: datosInfracciones.nombrePolicia
    })
  }
  updateInfraccion(datosInfracciones: Boleta) {
    this.listaInfracciones.update(datosInfracciones.$key, {
      //fechaHora: datosInfracciones.fechaHora,
      nombreConductor: datosInfracciones.nombreConductor,

      apPaternoConductor: datosInfracciones.apPaternoConductor,
      apMaternoConductor: datosInfracciones.apMaternoConductor,
      placa: datosInfracciones.placa,
      licenciaNum: datosInfracciones.licenciaNum,
      observacionInfraccion: datosInfracciones.observacionInfraccion,
      nombrePolicia: datosInfracciones.nombrePolicia
    })
  }
  deleteInfraccion($key: string) {
    this.listaInfracciones.remove($key);
  }

}