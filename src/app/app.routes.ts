import { Routes } from '@angular/router';
// Login / Registro
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
// Menu TMP Opciones
import { OpcionesComponent } from './components/opciones/opciones.component';
// Perfil Administrador Pri
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { ColegiosComponent } from './components/perfil-admin-pri/opciones/colegios/colegios.component';
import { DocentesComponent } from './components/perfil-admin-pri/opciones/docentes/docentes.component';
import { EstudiantesComponent } from './components/perfil-admin-pri/opciones/estudiantes/estudiantes.component';
import { MateriasComponent } from './components/perfil-admin-pri/opciones/materias/materias.component';
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
      { path: 'colegios', component: ColegiosComponent },
      { path: 'docentes', component: DocentesComponent },
      { path: 'estudiantes', component: EstudiantesComponent },
      { path: 'materias', component: MateriasComponent },
      // Otras rutas hijas
    ]
  }, // Ruta para el perfil de admin
  { path: 'perfil-admin-sec', component: PerfilAdminSecComponent },
  { path: 'perfil-docente', component: PerfilDocenteComponent },
  { path: 'perfil-estudiante', component: PerfilEstudianteComponent },
  { path: 'perfil-familia', component: PerfilFamiliaComponent },
  { path: '**', redirectTo: '' } // Redirección para rutas no válidas
];
