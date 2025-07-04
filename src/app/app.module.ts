import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';   // Importa ReactiveFormsModule aquí
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { RouterModule } from '@angular/router'; // Importa RouterModule para el enrutamiento
//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa BrowserAnimationsModule para animaciones de Angular Material
import { MatDialogModule } from '@angular/material/dialog'; // Importa MatDialogModule aquí
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule aquí
import { MatTabsModule } from '@angular/material/tabs';   // Importa MatTabsModule aquí
import { FormsModule } from '@angular/forms'; // <-- Agrega esto
// Inicio Principal
import { InicioComponent } from './inicio/inicio.component';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
import { LoginRecuperaComponent } from './components/login-recupera/login-recupera.component'; // Importar el componente de recuperación de contraseña
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
// Perfil Familia
import { PerfilEditorComponent } from './components/perfil-editor/perfil-editor.component';
// Otros Import
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginFormComponent,
    LoginRegistroComponent,
    LoginRecuperaComponent,
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
    RouterModule.forRoot(routes), // Configura las rutas de la aplicación
    //AppRoutingModule,
    FormsModule,              // <-- Agrega esto
    BrowserAnimationsModule,  // Necesario para Angular Material
    MatDialogModule,          // Importa MatDialogModule aquí
    MatButtonModule,          // Importa MatButtonModule aquí
    MatTabsModule,            // Importa MatTabsModule aquí
    ReactiveFormsModule,      // Importa ReactiveFormsModule aquí BackEnd
    HttpClientModule,         // Agrega HttpClientModule a los imports BackEnd
  ],
  providers: [
    provideAnimationsAsync()  // Proveedor para animaciones asincrónicas
  ],
  bootstrap: [AppComponent]   // Componente raíz de la aplicación
})
export class AppModule {}     // Módulo principal de la aplicación
