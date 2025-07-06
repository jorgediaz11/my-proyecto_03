import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';   // Importa ReactiveFormsModule aquí
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';   // Importa MatTabsModule aquí
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // Importa HttpClientModule
import { FormsModule } from '@angular/forms'; // <-- Agrega esto

// Inicio Principal
import { InicioComponent } from './inicio/inicio.component';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
// Menu TMP Opciones
import { OpcionesComponent } from './components/opciones/opciones.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { ReportesComponent } from './components/perfil-admin-pri/opciones/reportes/reportes.component'; // Importa el componente de reportes
import { AuditoriaComponent } from './components/perfil-admin-pri/opciones/auditoria/auditoria.component';
import { PerfilComponent } from './components/perfil-admin-pri/opciones/perfil/perfil.component';
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
import loggingInterceptor from './interceptors/logging,interceptor';
import authInterceptor from './interceptors/auth,interceptor';

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
    DocentesComponent,
    EstudiantesComponent,
    ReportesComponent,
    AuditoriaComponent,
    PerfilComponent,
    PerfilAdminSecComponent,
    PerfilDocenteComponent,
    PerfilEstudianteComponent,
    PerfilFamiliaComponent,
    //ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,            // Importa BrowserModule aquí
    FormsModule,              // <-- Agrega esto
    HttpClientModule,         // Agrega HttpClientModule a los imports BackEnd
    BrowserAnimationsModule,  // Necesario para Angular Material
    MatDialogModule,          // Importa MatDialogModule aquí
    MatButtonModule,          // Importa MatButtonModule aquí
    MatTabsModule,            // Importa MatTabsModule aquí
    ReactiveFormsModule,      // Importa ReactiveFormsModule aquí BackEnd
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideAnimationsAsync(),  // Proveedor para animaciones asincrónicas
    provideHttpClient(
      withFetch(),
      withInterceptors([loggingInterceptor, authInterceptor]),
    )
  ],
  bootstrap: [AppComponent]   // Componente raíz de la aplicación
})
export class AppModule {}     // Módulo principal de la aplicación
