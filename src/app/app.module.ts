import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
import { OpcionesComponent } from './components/opciones/opciones.component';
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    LoginRegistroComponent,
    OpcionesComponent,
    PerfilAdminPriComponent,
    PerfilAdminSecComponent,
    PerfilDocenteComponent,
    PerfilEstudianteComponent,
    PerfilFamiliaComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}