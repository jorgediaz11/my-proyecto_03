import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';   // Importa ReactiveFormsModule aquí
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa HttpClientModule
import { RouterModule } from '@angular/router'; // Importa RouterModule para el enrutamiento
//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa BrowserAnimationsModule para animaciones de Angular Material
import { MatDialogModule } from '@angular/material/dialog'; // Importa MatDialogModule aquí
import { MatButtonModule } from '@angular/material/button'; // Importa MatButtonModule aquí
import { MatTabsModule } from '@angular/material/tabs';   // Importa MatTabsModule aquí
import { FormsModule } from '@angular/forms'; // Importa FormsModule para formularios reactivos
// ✅ INTERCEPTORS IMPORTS
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

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
import { PerfilAdminPriMuroComponent } from './components/perfil-admin-pri/perfil-admin-pri-muro.component'; // Importa el componente de muro del perfil administrador
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { ReportesComponent } from './components/perfil-admin-pri/opciones/reportes/reportes.component'; // Importa el componente de reportes
import { AuditoriaComponent } from './components/perfil-admin-pri/opciones/auditoria/auditoria.component';
import { PerfilComponent } from './components/perfil-admin-pri/opciones/perfil/perfil.component';
import { AcademicoComponent } from './components/perfil-admin-pri/opciones/academico/academico.component';
// Perfil Administrador Sec
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilAdminSecMuroComponent } from './components/perfil-admin-sec/perfil-admin-sec-muro.component';
// Perfil Docente
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilDocenteMuroComponent } from './components/perfil-docente/perfil-docente-muro.component';
// Perfil Estudiante
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilEstudianteMuroComponent } from './components/perfil-estudiante/perfil-estudiante-muro.component';
// Perfil Familia
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';
import { PerfilFamiliaMuroComponent } from './components/perfil-familia/perfil-familia-muro.component';
// Perfil Editor
import { PerfilEditorComponent } from './components/perfil-editor/perfil-editor.component';
import { PerfilEditorMuroComponent } from './components/perfil-editor/perfil-editor-muro.component';

// Test Component
import { TestEndpointsComponent } from './test-endpoints.component';

// Otros Import
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginFormComponent,
    LoginRegistroComponent,
    LoginRecuperaComponent,
    OpcionesComponent,
    PerfilAdminPriComponent,
    PerfilAdminPriMuroComponent,
    UsuariosComponent,
    ColegiosComponent,
    DocentesComponent,
    EstudiantesComponent,
    ReportesComponent,
    AuditoriaComponent,
    PerfilComponent,
    AcademicoComponent,
    PerfilAdminSecComponent,
    PerfilAdminSecMuroComponent,
    PerfilDocenteComponent,
    PerfilDocenteMuroComponent,
    PerfilEstudianteComponent,
    PerfilEstudianteMuroComponent,
    PerfilFamiliaComponent,
    PerfilFamiliaMuroComponent,
    PerfilEditorComponent,
    PerfilEditorMuroComponent,
    TestEndpointsComponent,
    //AcademicoComponent,
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
    MatTabsModule,            // Importa MatTabsModule aquí
    MatTabsModule,            // Importa MatTabsModule aquí
    ReactiveFormsModule,      // Importa ReactiveFormsModule aquí BackEnd
    HttpClientModule,         // Agrega HttpClientModule a los imports BackEnd
  ],
  providers: [
    provideAnimations(),  // Proveedor para animaciones
    // ✅ INTERCEPTORS PARA AUTENTICACIÓN AUTOMÁTICA
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    },
    // ✅ INTERCEPTOR PARA MANEJO GLOBAL DE ERRORES
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    // ✅ INTERCEPTOR PARA LOADING GLOBAL
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]   // Componente raíz de la aplicación
})
export class AppModule { }
