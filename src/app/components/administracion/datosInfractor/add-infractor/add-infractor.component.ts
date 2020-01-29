import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { NotificationsService } from 'angular2-notifications';
import { DateAdapter } from '@angular/material';
import { Infractor } from 'src/app/models/Infractor/infractor';

@Component({
  selector: 'app-add-infractor',
  templateUrl: './add-infractor.component.html',
  styleUrls: ['./add-infractor.component.css']
})
export class AddInfractorComponent implements OnInit {

  datosInfractor: FormGroup

  get nombreInfractor() {return this.datosInfractor.get('nombreInfractor')}
  get apPaternoInfractor() {return this.datosInfractor.get('apPaternoInfractor')}
  get apMaternoInfractor() {return this.datosInfractor.get('apMaternoInfractor')}
  get ciInfractor() {return this.datosInfractor.get('ciInfractor')}
  get sexoInfractor() {return this.datosInfractor.get('sexoInfractor')}
  get celularInfractor() {return this.datosInfractor.get('celularInfractor')}
  get fechaNacimientoInfractor() {return this.datosInfractor.get('fechaNacimientoInfractor')}
  get direccionInfractor() {return this.datosInfractor.get('direccionInfractor')}
  get licenciaInfractor() {return this.datosInfractor.get('licenciaInfractor')}

  constructor(
    public servicioServices:ServiciosService,
    public notificaciones: NotificationsService,
    public builder: FormBuilder,
    private _adapter: DateAdapter<any>
  ) { 
    this.datosInfractor = this.builder.group({
      licenciaInfractor: [''],
      nombreInfractor: [''],
      apPaternoInfractor: [''],
      apMaternoInfractor: [''],
      sexoInfractor: [''],
      celularInfractor: [''],
      fechaNacimientoInfractor: [''],
      direccionInfractor: [''],
    })
  }

  ngOnInit() {
    this.servicioServices.getInfractor();
  }

  addInfractor(servicioInfractor: NgForm){
    if(servicioInfractor.valid){
      if (servicioInfractor.value.$key == null){
        this.servicioServices.insertInfractor(servicioInfractor.value)
        this.notificaciones.success('Exitosamente','Datos guardados correctamente',{
          timeOut: 3000,
          showProgressBar:true
        })
      }
      else{
        this.servicioServices.updateInfractor(servicioInfractor.value)
        this.notificaciones.success('Exitosamente','Datos actualizados correctamente',{
          timeOut: 3000,
          showProgressBar:true
        })
      }
      this.resetForm(servicioInfractor)
    }else{
      console.log('Error no valido');
      
    }
  }

  resetForm(servicioInfractor ? : NgForm) {
    if (servicioInfractor != null) {
      servicioInfractor.reset();
      this.servicioServices.seleccionarInfractor = new Infractor();
    }
  }

}