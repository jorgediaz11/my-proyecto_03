import { Routes } from '@angular/router';
// Inicio
import { InicioComponent } from './inicio/inicio.component';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
// Menu TMP Opciones
import { OpcionesComponent } from './components/opciones/opciones.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { PerfilAdminPriMuroComponent } from './components/perfil-admin-pri/perfil-admin-pri-muro.component'; // Importar el nuevo componente
import { UsuariosComponent } from './components/perfil-admin-pri/opciones/usuarios/usuarios.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { AcademicoComponent } from './components/perfil-admin-pri/opciones/academico/academico.component';
import { ReportesComponent } from './components/perfil-admin-pri/opciones/reportes/reportes.component';
import { AuditoriaComponent } from './components/perfil-admin-pri/opciones/auditoria/auditoria.component';
import { PerfilComponent } from './components/perfil-admin-pri/opciones/perfil/perfil.component';
// Perfil Administrador Sec
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilAdminSecMuroComponent } from './components/perfil-admin-sec/perfil-admin-sec-muro.component'; // Importar el nuevo componente
// Perfil Docente
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilDocenteMuroComponent } from './components/perfil-docente/perfil-docente-muro.component';     // Importar el nuevo componente
// Perfil Estudiante
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilEstudianteMuroComponent } from './components/perfil-estudiante/perfil-estudiante-muro.component';   // Importar el nuevo componente
// Perfil Familia
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';
import { PerfilFamiliaMuroComponent } from './components/perfil-familia/perfil-familia-muro.component';   // Importar el nuevo componente

// Confirm Dialog
export const routes: Routes = [
// Ruta para el inicio
  { path: '', component: InicioComponent }, // Componente inicial

  // Ruta para el login y registro
  { path: 'login', component: LoginFormComponent },         // Ruta para el login
  { path: 'login-registro', component: LoginRegistroComponent },  // Ruta para el registro

  // Ruta para el menú de opciones
  { path: 'opciones', component: OpcionesComponent },       // Ruta para la página de opciones

  // Ruta para el perfil de admin
  { path: 'perfil-admin-pri',                               // Ruta para el perfil de admin pri
    component: PerfilAdminPriComponent,
    children: [
      { path: '', component: PerfilAdminPriMuroComponent }, // Ruta predeterminada
      { path: 'usuarios', component: UsuariosComponent },   // Ruta para la sección de usuarios
      { path: 'colegios', component: ColegiosComponent },   // Ruta para la sección de colegios
      { path: 'docentes', component: DocentesComponent },   // Ruta para la sección de docentes
      { path: 'estudiantes', component: EstudiantesComponent }, // Ruta para la sección de estudiantes
      { path: 'academico', component: AcademicoComponent }, // Ruta para la sección académica
      { path: 'reportes', component: ReportesComponent },   // Ruta para la sección de reportes
      { path: 'auditoria', component: AuditoriaComponent }, // Ruta para la sección de configuración
      { path: 'perfil', component: PerfilComponent },       // Ruta para la sección de reportes
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de admin sec
  { path: 'perfil-admin-sec',                               // Ruta para el perfil de admin sec
    component: PerfilAdminSecComponent,
    children: [
      { path: '', component: PerfilAdminSecMuroComponent }  // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de docente
  { path: 'perfil-docente',
    component: PerfilDocenteComponent,                      // Ruta para el perfil de docente
    children: [
      { path: '', component: PerfilDocenteMuroComponent }   // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de estudiante
  { path: 'perfil-estudiante',
    component: PerfilEstudianteComponent,                   // Ruta para el perfil de estudiante
    children: [
      { path: '', component: PerfilEstudianteMuroComponent }  // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Ruta para el perfil de familia
  { path: 'perfil-familia',
    component: PerfilFamiliaComponent,                      // Ruta para el perfil de familia
    children: [
      { path: '', component: PerfilFamiliaMuroComponent }   // Ruta predeterminada
      // Otras rutas hijas
    ]
  },

// Redirección para rutas no válidas
  { path: '**', redirectTo: '' }                            // Redirige a la ruta inicial si no se encuentra la ruta solicitada
];
