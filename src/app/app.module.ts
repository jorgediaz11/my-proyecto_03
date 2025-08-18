import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';   // Importa ReactiveFormsModule aquí
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa HttpClientModule
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
import { AreasComponent } from './components/perfil-admin-pri/opciones/areas/areas.component';
import { CursosDetalleComponent } from './components/perfil-admin-pri/opciones/cursos-detalle/cursos-detalle.component';
import { LeccionesComponent } from './components/perfil-admin-pri/opciones/lecciones/lecciones.component';
import { LibrosComponent } from './components/perfil-admin-pri/opciones/libros/libros.component';
import { OpcionesComponent } from './components/perfil-admin-pri/opciones/opciones/opciones.component';
import { PreguntasComponent } from './components/perfil-admin-pri/opciones/preguntas/preguntas.component';
// import { ActivarLibrosComponent } from './components/activar-libros/activar-libros.component';
import { CuestionariosComponent } from './components/perfil-admin-pri/opciones/cuestionarios/cuestionarios.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { PerfilAdminPriMuroComponent } from './components/perfil-admin-pri/perfil-admin-pri-muro.component'; // Importa el componente de muro del perfil administrador
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { ReportesComponent } from './components/perfil-admin-pri/opciones/reportes/reportes.component'; // Importa el componente de reportes
import { AuditoriaComponent } from './components/perfil-admin-pri/opciones/auditoria/auditoria.component';
import { PerfilComponent } from './components/perfil-admin-pri/opciones/perfiles/perfiles.component';
import { AcademicoComponent } from './components/perfil-admin-pri/opciones/academico/academico.component';
import { CursosComponent } from './components/perfil-admin-pri/opciones/cursos/cursos.component';
import { ClasesColComponent } from './components/perfil-admin-pri/opciones/clases-col/clases-col.component';
import { NivelesComponent } from './components/perfil-admin-pri/opciones/niveles/niveles.component';
import { GradosComponent } from './components/perfil-admin-pri/opciones/grados/grados.component';
import { SeccionesComponent } from './components/perfil-admin-pri/opciones/secciones/secciones.component';
import { GrupofamComponent } from './components/perfil-admin-pri/opciones/grupofam/grupofam.component';
import { UnidadesComponent } from './components/perfil-admin-pri/opciones/unidades/unidades.component';
import { MaterialesComponent } from './components/perfil-admin-pri/opciones/materiales/materiales.component';
import { TipoMaterialComponent } from './components/perfil-admin-pri/opciones/tipo-material/tipo-material.component';
import { ActividadesComponent } from './components/perfil-admin-pri/opciones/actividades/actividades.component';
import { TipoActividadComponent } from './components/perfil-admin-pri/opciones/tipo-actividad/tipo-actividad.component';
import { PeriodoAcademicoComponent } from './components/perfil-admin-pri/opciones/periodo-academico/periodo-academico.component';
import { AulasComponent } from './components/perfil-admin-pri/opciones/aulas/aulas.component';
// Perfil Administrador Sec
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilAdminSecMuroComponent } from './components/perfil-admin-sec/perfil-admin-sec-muro.component';
// Perfil Docente
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilDocenteMuroComponent } from './components/perfil-docente/perfil-docente-muro.component';
// Perfil Estudiante
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
//import { PerfilEstudianteMuroComponent } from './components/perfil-estudiante/perfil-estudiante-muro.component';
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
        AreasComponent,
        CursosDetalleComponent,
        LeccionesComponent,
        LibrosComponent,
        OpcionesComponent,
        // ActivarLibrosComponent, // Ahora standalone, no va en declarations
        PerfilAdminPriComponent,
        PerfilAdminPriMuroComponent,
        // UsuariosComponent, // standalone, move to imports
        // ColegiosComponent, // standalone, move to imports
        DocentesComponent,
        EstudiantesComponent,
        ClasesColComponent,
        GrupofamComponent,
        UnidadesComponent,
        ReportesComponent,
        AuditoriaComponent,
        // PerfilComponent, // standalone, move to imports
        MaterialesComponent,
        TipoMaterialComponent,
    // CursosComponent, // standalone, move to imports
        NivelesComponent,
        GradosComponent,
        SeccionesComponent,
        AcademicoComponent,
        PerfilAdminSecComponent,
        PerfilAdminSecMuroComponent,
        PerfilDocenteComponent,
        PerfilDocenteMuroComponent,
        PerfilEstudianteComponent,
        PerfilFamiliaComponent,
        PerfilFamiliaMuroComponent,
        PerfilEditorComponent,
        PerfilEditorMuroComponent,
        TestEndpointsComponent,
        ClasesColComponent,
        ActividadesComponent,
        TipoActividadComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatTabsModule,
        ReactiveFormsModule,
        AngularEditorModule,
        CuestionariosComponent, // standalone
        CuestionariosComponent, // standalone
        PreguntasComponent, // standalone
        PreguntasComponent, // standalone
        PerfilComponent, // standalone
        PeriodoAcademicoComponent, // standalone
        UsuariosComponent, // standalone
        ColegiosComponent, // standalone
    AulasComponent, // standalone
    CursosComponent // standalone
    ],
    providers: [
        provideAnimations(),
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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
