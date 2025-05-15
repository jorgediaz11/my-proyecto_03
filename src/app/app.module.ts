import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';

// Inicio Principal
import { InicioComponent } from './inicio/inicio.component';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
// Menu TMP Opciones
import { OpcionesComponent } from './components/opciones/opciones.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';

// Perfil Administrador Sec
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
// Perfil Docente
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
// Perfil Estudiante
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
// Perfil Familia
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';
// Otros Import
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginFormComponent,
    LoginRegistroComponent,
    OpcionesComponent,
    PerfilAdminPriComponent,
    UsuariosComponent,
    ColegiosComponent,
    PerfilAdminSecComponent,
    PerfilDocenteComponent,
    PerfilEstudianteComponent,
    PerfilFamiliaComponent,
    //ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Necesario para Angular Material
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule, // Importa ReactiveFormsModule aquí
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
