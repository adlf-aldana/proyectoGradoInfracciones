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
import { GestionUsuario } from '../models/gestionarUsuarios/gestion-usuario';
import * as crypto from 'crypto-js';

import {
  NotificationsService
} from 'angular2-notifications';
import { Testigo } from '../models/Testigos/testigo';
import { Bitacora } from '../models/bitacora/bitacora';


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
  seleccionarColorVehiculo: ColorVehiculos = new ColorVehiculos();
  seleccionarInfractor: Infractor = new Infractor();
  seleccionarDatosVehiculo: DatosVehiculo = new DatosVehiculo();
  seleccionarUsuario: GestionUsuario = new GestionUsuario();
  seleccionarTestigo: Testigo = new Testigo();
  seleccionarBitacora: Bitacora = new Bitacora();

  listaInfracciones: AngularFireList<any>;
  listaServiciosVehiculares: AngularFireList<any>;
  listaCodigoTransito: AngularFireList<any>;
  listaCargos: AngularFireList<any>;
  listaPersonal: AngularFireList<any>;
  listaTipoVehiculo: AngularFireList<any>;
  listaMarcaVehiculo: AngularFireList<any>;
  listaColorVehiculo: AngularFireList<any>;
  listaInfractor: AngularFireList<any>;
  listDatosVehiculo: AngularFireList<any>;
  listUsuario: AngularFireList<any>;
  listTestigo: AngularFireList<any>;
  listBitacora: AngularFireList<any>;


  constructor(private firebase: AngularFireDatabase, private notificaciones: NotificationsService) { }

  getBitacora() {
    return this.listBitacora = this.firebase.list('bitacora');
  }
  insertBitacora(nombre: string, apPaterno: string, apMaterno: string,cedula: string, fechaHora:string, evento: string) {
    this.getBitacora()
    let event = crypto.AES.encrypt(evento, this.keySecret.trim()).toString()
    this.listBitacora.push({
      nombre: nombre,
      apPaterno: apPaterno,
      apMaterno: apMaterno,
      cedula: cedula,
      fechaHora: fechaHora,
      evento: event
    })
  }
  // updateBitacora(datosTestigo: Testigo) {
  //   this.listTestigo.update(datosTestigo.$key, {
  //     nombreTestigo: datosTestigo.nombreTestigo,
  //     apPaternoTestigo: datosTestigo.apPaternoTestigo,
  //     apMaternoTestigo: datosTestigo.apMaternoTestigo,
  //     cedulaIdentidadTestigo: datosTestigo.cedulaIdentidadTestigo,
  //     celularTestigo: datosTestigo.celularTestigo || null
  //   })
  // }
  // deleteBitacora($key: string) {
  //   this.listTestigo.remove($key);
  // }


  getTestigo() {
    return this.listTestigo = this.firebase.list('testigos');
  }
  insertTestigo(datosTestigo: Testigo) {
    this.listTestigo.push({
      nombreTestigo: datosTestigo.nombreTestigo,
      apPaternoTestigo: datosTestigo.apPaternoTestigo,
      apMaternoTestigo: datosTestigo.apMaternoTestigo,
      cedulaIdentidadTestigo: datosTestigo.cedulaIdentidadTestigo,
      celularTestigo: datosTestigo.celularTestigo || null
    })
  }
  updateTestigo(datosTestigo: Testigo) {
    this.listTestigo.update(datosTestigo.$key, {
      nombreTestigo: datosTestigo.nombreTestigo,
      apPaternoTestigo: datosTestigo.apPaternoTestigo,
      apMaternoTestigo: datosTestigo.apMaternoTestigo,
      cedulaIdentidadTestigo: datosTestigo.cedulaIdentidadTestigo,
      celularTestigo: datosTestigo.celularTestigo || null
    })
  }
  deleteTestigo($key: string) {
    this.listTestigo.remove($key);
  }

  getUsuario() {
    return this.listUsuario = this.firebase.list('gestionUsuarios');
  }
  insertUsuario(datosUsuario: GestionUsuario) {
    let ciUsuario = crypto.AES.encrypt(datosUsuario.ciUsuario, this.keySecret.trim()).toString()
    let correoUsuario = crypto.AES.encrypt(datosUsuario.correoUsuario, this.keySecret.trim()).toString()
    let cargoUsuario = crypto.AES.encrypt(datosUsuario.cargoUsuario, this.keySecret.trim()).toString()
    let password = crypto.AES.encrypt(datosUsuario.password, this.keySecret.trim()).toString()
    this.listUsuario.push({
      ciUsuario: ciUsuario,
      // nombreUsuario: datosUsuario.nombreUsuario,
      correoUsuario: correoUsuario,
      cargoUsuario: cargoUsuario,
      password: password,
    })
  }
  updateUsuario(datosUsuario: GestionUsuario) {
    let ciUsuario = crypto.AES.encrypt(datosUsuario.ciUsuario, this.keySecret.trim()).toString()
    let correoUsuario = crypto.AES.encrypt(datosUsuario.correoUsuario, this.keySecret.trim()).toString()
    let cargoUsuario = crypto.AES.encrypt(datosUsuario.cargoUsuario, this.keySecret.trim()).toString()
    let password = crypto.AES.encrypt(datosUsuario.password, this.keySecret.trim()).toString()       
    this.listUsuario.update(datosUsuario.$key, {
      ciUsuario: ciUsuario,
      // nombreUsuario: datosUsuario.nombreUsuario,
      correoUsuario: correoUsuario,
      cargoUsuario: cargoUsuario,
      password: password,
    })
  }
  deleteUsuario($key: string) {
    this.listUsuario.remove($key);
  }

  getDatosVehiculo() {
    return this.listDatosVehiculo = this.firebase.list('datosVehiculo');
  }
  insertDatosVehiculo(datosVehiculo: DatosVehiculo) {
    this.listDatosVehiculo.push({
      tipoVehiculo: datosVehiculo.tipo,
      marcaVehiculo: datosVehiculo.marca,
      colorVehiculo: datosVehiculo.color,
      placa: datosVehiculo.placa,
      tipoServicio: datosVehiculo.tipoServicio,

      nombreInfractor: datosVehiculo.nombreInfractor || null,
      apPaternoInfractor: datosVehiculo.apPaternoInfractor || null,
      apMaternoInfractor: datosVehiculo.apMaternoInfractor || null,
      numLicencia: datosVehiculo.numLicencia || null,
      sexoInfractor: datosVehiculo.sexoInfractor || null,
      fechaNacimientoInfractor: datosVehiculo.fechaNacimientoInfractor || null,
      celularInfractor: datosVehiculo.celularInfractor || null,
      direccionInfractor: datosVehiculo.direccionInfractor || null
    })
  }
  updateDatosVehiculo(datosVehiculo: DatosVehiculo) {
    this.listDatosVehiculo.update(datosVehiculo.$key, {
      placa: datosVehiculo.placa,
      tipoVehiculo: datosVehiculo.tipo,
      marcaVehiculo: datosVehiculo.marca,
      colorVehiculo: datosVehiculo.color,
      tipoServicio: datosVehiculo.tipoServicio,

      nombreInfractor: datosVehiculo.nombreInfractor,
      apPaternoInfractor: datosVehiculo.apPaternoInfractor,
      apMaternoInfractor: datosVehiculo.apMaternoInfractor,
      numLicencia: datosVehiculo.numLicencia,
      sexoInfractor: datosVehiculo.sexoInfractor,
      fechaNacimientoInfractor: datosVehiculo.fechaNacimientoInfractor,
      celularInfractor: datosVehiculo.celularInfractor || null,
      direccionInfractor: datosVehiculo.direccionInfractor || null
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
    let nombreColorVehiculo = crypto.AES.encrypt(colorVehiculo.nombreColorVehiculo, this.keySecret.trim()).toString()
    this.listaColorVehiculo.push({
      nombreColorVehiculo: nombreColorVehiculo
    })
  }
  updateColorVehiculo(colorVehiculo: ColorVehiculos) {
    let nombreColorVehiculo = crypto.AES.encrypt(colorVehiculo.nombreColorVehiculo, this.keySecret.trim()).toString()
    this.listaColorVehiculo.update(colorVehiculo.$key, {
      nombreColorVehiculo: nombreColorVehiculo
    })
  }
  deleteColorVehiculo($key: string) {
    this.listaColorVehiculo.remove($key);
  }

  getMarcaVehiculo() {
    return this.listaMarcaVehiculo = this.firebase.list('marcaVehiculos');
  }
  insertMarcaVehiculo(marcaVehiculo: MarcaVehiculos) {
    let nombreMarcaVehiculos = crypto.AES.encrypt(marcaVehiculo.nombreMarcaVehiculos, this.keySecret.trim()).toString()
    this.listaMarcaVehiculo.push({
      nombreMarcaVehiculos: nombreMarcaVehiculos
    })
  }
  updateMarcaVehiculo(marcaVehiculo: MarcaVehiculos) {
    let nombreMarcaVehiculos = crypto.AES.encrypt(marcaVehiculo.nombreMarcaVehiculos, this.keySecret.trim()).toString()
    this.listaMarcaVehiculo.update(marcaVehiculo.$key, {
      nombreMarcaVehiculos: nombreMarcaVehiculos
    })
  }
  deleteMarcaVehiculo($key: string) {
    this.listaMarcaVehiculo.remove($key);
  }


  getTipoVehiculo() {
    return this.listaTipoVehiculo = this.firebase.list('tipoVehiculos');
  }
  insertTipoVehiculo(tipoVehiculo: TipoVehiculo) {
    let nombreTipoVehiculo = crypto.AES.encrypt(tipoVehiculo.nombreTipoVehiculo, this.keySecret.trim()).toString()
    this.listaTipoVehiculo.push({
      nombreTipoVehiculo: nombreTipoVehiculo
    })
  }
  updateTipoVehiculo(tipoVehiculo: TipoVehiculo) {
    let nombreTipoVehiculo = crypto.AES.encrypt(tipoVehiculo.nombreTipoVehiculo, this.keySecret.trim()).toString()
    this.listaTipoVehiculo.update(tipoVehiculo.$key, {
      nombreTipoVehiculo: nombreTipoVehiculo
    })
  }
  deleteTipoVehiculo($key: string) {
    this.listaTipoVehiculo.remove($key);
  }


  getPersonal() {
    return this.listaPersonal = this.firebase.list('personalTransito');
  }
  insertPersonal(personalTransito: Personal) {
    var nombrePersonal = crypto.AES.encrypt(personalTransito.nombrePersonal, this.keySecret.trim()).toString();
    var apPaternoPersonal = crypto.AES.encrypt(personalTransito.apPaternoPersonal, this.keySecret.trim()).toString();
    var apMaternoPersonal = crypto.AES.encrypt(personalTransito.apMaternoPersonal, this.keySecret.trim()).toString();
    var ciPersonal = crypto.AES.encrypt(personalTransito.ciPersonal, this.keySecret.trim()).toString();
    var sexoPersonal = crypto.AES.encrypt(personalTransito.sexoPersonal, this.keySecret.trim()).toString();
    var fechaNacimientoPersonal = crypto.AES.encrypt(personalTransito.fechaNacimientoPersonal, this.keySecret.trim()).toString();
    var celularPersonal = crypto.AES.encrypt(personalTransito.celularPersonal, this.keySecret.trim()).toString();
    var direccionPersonal = crypto.AES.encrypt(personalTransito.direccionPersonal, this.keySecret.trim()).toString();

    this.listaPersonal.push({
      nombrePersonal: nombrePersonal,
      apPaternoPersonal: apPaternoPersonal,
      apMaternoPersonal: apMaternoPersonal,
      ciPersonal: ciPersonal,
      sexoPersonal: sexoPersonal,
      fechaNacimientoPersonal: fechaNacimientoPersonal,
      celularPersonal: celularPersonal,
      direccionPersonal: direccionPersonal
    })
  }
  updatePersonal(personalTransito: Personal) {
    var nombrePersonal = crypto.AES.encrypt(personalTransito.nombrePersonal, this.keySecret.trim()).toString();
    var apPaternoPersonal = crypto.AES.encrypt(personalTransito.apPaternoPersonal, this.keySecret.trim()).toString();
    var apMaternoPersonal = crypto.AES.encrypt(personalTransito.apMaternoPersonal, this.keySecret.trim()).toString();
    var ciPersonal = crypto.AES.encrypt(personalTransito.ciPersonal, this.keySecret.trim()).toString();
    var sexoPersonal = crypto.AES.encrypt(personalTransito.sexoPersonal, this.keySecret.trim()).toString();
    var fechaNacimientoPersonal = crypto.AES.encrypt(personalTransito.fechaNacimientoPersonal, this.keySecret.trim()).toString();
    var celularPersonal = crypto.AES.encrypt(personalTransito.celularPersonal, this.keySecret.trim()).toString();
    var direccionPersonal = crypto.AES.encrypt(personalTransito.direccionPersonal, this.keySecret.trim()).toString();
    
    this.listaPersonal.update(personalTransito.$key, {
      nombrePersonal: nombrePersonal,
      apPaternoPersonal: apPaternoPersonal,
      apMaternoPersonal: apMaternoPersonal,
      ciPersonal: ciPersonal,
      sexoPersonal: sexoPersonal,
      fechaNacimientoPersonal: fechaNacimientoPersonal,
      celularPersonal: celularPersonal,
      direccionPersonal: direccionPersonal
    })
  }
  deletePersonal($key: string) {
    this.listaPersonal.remove($key);
  }
  
  keySecret = "proyectoGradoUsfxTransito"

  getCargo() {
    return this.listaCargos = this.firebase.list('cargosTransito');
  }
  insertCargos(cargoTransito: Cargos) {

    var encrip = crypto.AES.encrypt(cargoTransito.cargo, this.keySecret.trim()).toString();
    // console.log(encrip);
    this.listaCargos.push({
      cargo: encrip
    })
  }
  updateCargos(cargoTransito: Cargos) {
    var encrip = crypto.AES.encrypt(cargoTransito.cargo, this.keySecret.trim()).toString();

    // console.log(cargoTransito.$key);
    this.listaCargos.update(cargoTransito.$key, {
      // cargo: cargoTransito.cargo
      cargo: encrip
    })
  }
  deleteCargos($key: string) {
    this.listaCargos.remove($key);
  }


  getCodigoTransito() {
    return this.listaCodigoTransito = this.firebase.list('codigosTransito');
  }
  insertCodigosTransito(codigoTransito: CodigoTransito) {
    let articulo = crypto.AES.encrypt(codigoTransito.articulo, this.keySecret.trim()).toString()
    let numero = crypto.AES.encrypt(codigoTransito.numero, this.keySecret.trim()).toString()
    let descripcion = crypto.AES.encrypt(codigoTransito.descripcion, this.keySecret.trim()).toString()
    this.listaCodigoTransito.push({
      articulo: articulo,
      numero: numero,
      descripcion: descripcion
    })
  }
  updateCodigosTransito(codigoTransito: CodigoTransito) {
    let articulo = crypto.AES.encrypt(codigoTransito.articulo, this.keySecret.trim()).toString()
    let numero = crypto.AES.encrypt(codigoTransito.numero, this.keySecret.trim()).toString()
    let descripcion = crypto.AES.encrypt(codigoTransito.descripcion, this.keySecret.trim()).toString()
    this.listaCodigoTransito.update(codigoTransito.$key, {
      articulo: articulo,
      numero: numero,
      descripcion: descripcion
    })
  }
  deleteCodigoTransito($key: string) {
    this.listaCodigoTransito.remove($key);
  }


  getServiciosVehiculares() {
    return this.listaServiciosVehiculares = this.firebase.list('serviciosVehiculares');
  }
  insertTipoServicioVehicular(tsv: Tipo) {
    var nombreTipoServicio = crypto.AES.encrypt(tsv.nombreTipoServicio, this.keySecret.trim()).toString();
    // console.log(this.listaServiciosVehiculares);
    this.listaServiciosVehiculares.push({
      nombreTipoServicio: nombreTipoServicio
    })
  }
  updateTipoServicioVehicular(tsv: Tipo) {
    var nombreTipoServicio = crypto.AES.encrypt(tsv.nombreTipoServicio, this.keySecret.trim()).toString();
    this.listaServiciosVehiculares.update(tsv.$key, {
      nombreTipoServicio: nombreTipoServicio
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
      fechaInfraccion: datosInfracciones.fechaInfraccion,
      placa: datosInfracciones.placa,
      lat: datosInfracciones.lat,
      lng: datosInfracciones.lng,
      art: datosInfracciones.art,
      num: datosInfracciones.num,

      // foto1: datosInfracciones.foto1 || null,
      // foto2: datosInfracciones.foto2 || null,
      base64Srt: datosInfracciones.base64Srt || null,

      // foto3: datosInfracciones.foto3 || null,
      // foto4: datosInfracciones.foto4 || null,
      // foto5: datosInfracciones.foto5 || null,
      descripcion: datosInfracciones.descripcion,

      nombreInfractor: datosInfracciones.nombreInfractor,
      apPaternoInfractor: datosInfracciones.apPaternoInfractor,
      apMaternoInfractor: datosInfracciones.apMaternoInfractor,
      numLicenciaInfractor: datosInfracciones.numLicenciaInfractor,

      cedulaIdentidadTestigo: datosInfracciones.cedulaIdentidadTestigo || null,
      nombreTestigo: datosInfracciones.nombreTestigo || null,
      apPaternoTestigo: datosInfracciones.apPaternoTestigo || null,
      apMaternoTestigo: datosInfracciones.apMaternoTestigo || null,
      celularTestigo: datosInfracciones.celularTestigo || null,

      nombrePersonal: datosInfracciones.nombrePersonal,
      apPaternoPersonal: datosInfracciones.apPaternoPersonal,
      apMaternoPersonal: datosInfracciones.apMaternoPersonal,
      ciPersonal: datosInfracciones.ciPersonal
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

  formatDate(date: Date): string {
    const day = date.getDate();
    var dia;
    if (day < 9)
      dia = ("0" + day).toString();
    else
      dia = day

    var month = date.getMonth() + 1;
    var mes;
    if (month <= 9)
      mes = ("0" + month).toString();
    else
      mes = month


    const year = date.getFullYear();
    return (mes + "-" + dia + "-" + year);
  }

}