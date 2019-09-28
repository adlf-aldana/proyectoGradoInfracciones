import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import {AngularFireDatabaseModule} from 'angularfire2/database'
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

// Servicios


// Rutas
import { RouterModule,Routes} from '@angular/router'
// Forms
import { FormsModule } from '@angular/forms';


import { AddCodigoTransitoComponent } from './components/administracion/codigoTransito/add-codigo-transito/add-codigo-transito.component';
import { ListCodigoTransitoComponent } from './components/administracion/codigoTransito/list-codigo-transito/list-codigo-transito.component';
import { AddColorVehiculoComponent } from './components/administracion/gestion-vehiculos/colorVehiculo/add-color-vehiculo/add-color-vehiculo.component';
import { ListColorVehiculoComponent } from './components/administracion/gestion-vehiculos/colorVehiculo/list-color-vehiculo/list-color-vehiculo.component';
import { AddMarcaVehiculoComponent } from './components/administracion/gestion-vehiculos/marcaVehiculo/add-marca-vehiculo/add-marca-vehiculo.component';
import { ListMarcaVehiculoComponent } from './components/administracion/gestion-vehiculos/marcaVehiculo/list-marca-vehiculo/list-marca-vehiculo.component';
import { AddTipoVehiculoComponent } from './components/administracion/gestion-vehiculos/tipoVehiculo/add-tipo-vehiculo/add-tipo-vehiculo.component';
import { ListTipoVehiculoComponent } from './components/administracion/gestion-vehiculos/tipoVehiculo/list-tipo-vehiculo/list-tipo-vehiculo.component';
import { AddServicesComponent } from './components/administracion/servicios/add-services/add-services.component';
import { ListaServiciosComponent } from './components/administracion/servicios/lista-servicios/lista-servicios.component';
import { BoletaInfraccionComponent } from './components/boleta-infraccion/boleta-infraccion.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { CodigoInfraccionesComponent } from './components/codigo-infracciones/codigo-infracciones.component';
import { MultasRegistradasComponent } from './components/multas-registradas/multas-registradas.component';
import { ListaMultasComponent } from './components/multasRegistradas/lista-multas/lista-multas.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SimpleNotificationsModule } from "angular2-notifications";
import { AddPersonalTransitoComponent } from './components/administracion/personalTransito/add-personal-transito/add-personal-transito.component';
import { ListPersonalTransitoComponent } from './components/administracion/personalTransito/list-personal-transito/list-personal-transito.component';
import { AddCargoComponent } from './components/administracion/cargo/add-cargo/add-cargo.component';
import { ListCargoComponent } from './components/administracion/cargo/list-cargo/list-cargo.component';
import { GestionVehiculosComponent } from './components/administracion/gestion-vehiculos/gestion-vehiculos.component';
import { ServiciosService } from './services/servicios.service';


//Crea variable donde estarán todas las rutas
const misRutas: Routes = [
  { path: 'Registro', component : BoletaInfraccionComponent, pathMatch: 'full'},
  { path: '', component : BoletaInfraccionComponent },
  { path: 'Multas', component : ListaMultasComponent},
  { path: 'Administrador', component: AdministracionComponent},
  { path: 'Código de Infracciones de Transporte', component: CodigoInfraccionesComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AddCargoComponent,
    ListCargoComponent,
    AddCodigoTransitoComponent,
    ListCodigoTransitoComponent,
    GestionVehiculosComponent,
    AddColorVehiculoComponent,
    ListColorVehiculoComponent,
    AddMarcaVehiculoComponent,
    ListMarcaVehiculoComponent,
    AddTipoVehiculoComponent,
    ListTipoVehiculoComponent,
    AddPersonalTransitoComponent,
    ListPersonalTransitoComponent,
    AddServicesComponent,
    ListaServiciosComponent,
    BoletaInfraccionComponent,
    CabeceraComponent,
    CodigoInfraccionesComponent,
    MultasRegistradasComponent,
    ListaMultasComponent,
    AdministracionComponent,
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(misRutas),
    FormsModule,
    BrowserAnimationsModule,
    // SimpleNotificationsModule.forRoot(),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ServiciosService],
  bootstrap: [AppComponent]
})
export class AppModule { }