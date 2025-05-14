import { Routes } from '@angular/router';
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
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent },              // Ruta para el login
  { path: 'registro', component: LoginRegistroComponent },  // Ruta para el registro
  { path: 'opciones', component: OpcionesComponent },       // Ruta para la página de opciones
  { path: 'perfil-admin-pri',                               // Ruta para el perfil de admin pri
    component: PerfilAdminPriComponent,
    children: [
      { path: '', component: PerfilAdminPriMuroComponent }, // Ruta predeterminada
      { path: 'usuarios', component: UsuariosComponent },   // Ruta para la sección de usuarios
      { path: 'colegios', component: ColegiosComponent },   // Ruta para la sección de colegios
      { path: 'docentes', component: DocentesComponent },   // Ruta para la sección de docentes
      { path: 'estudiantes', component: EstudiantesComponent }, // Ruta para la sección de estudiantes
      { path: 'academico', component: AcademicoComponent },     // Ruta para la sección académica
      { path: 'reportes', component: ReportesComponent },    // Ruta para la sección de reportes
      { path: 'auditoria', component: AuditoriaComponent },   // Ruta para la sección de configuración
      { path: 'perfil', component: PerfilComponent },    // Ruta para la sección de reportes
      // Otras rutas hijas
    ]
  }, // Ruta para el perfil de admin
  { path: 'perfil-admin-sec', component: PerfilAdminSecComponent },
  { path: 'perfil-docente', component: PerfilDocenteComponent },
  { path: 'perfil-estudiante', component: PerfilEstudianteComponent },
  { path: 'perfil-familia', component: PerfilFamiliaComponent },
  { path: '**', redirectTo: '' } // Redirección para rutas no válidas
];
