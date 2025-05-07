import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OpcionesComponent } from './components/opciones/opciones.component';
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';
import { PerfilAdminSecComponent } from './components/perfil-admin-sec/perfil-admin-sec.component';
import { PerfilDocenteComponent } from './components/perfil-docente/perfil-docente.component';
import { PerfilEstudianteComponent } from './components/perfil-estudiante/perfil-estudiante.component';
import { PerfilFamiliaComponent } from './components/perfil-familia/perfil-familia.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent }, // Ruta para el login
  { path: 'opciones', component: OpcionesComponent }, // Ruta para la página de opciones
  { path: 'perfil-admin-pri', component: PerfilAdminPriComponent }, // Ruta para el perfil de admin
  { path: 'perfil-admin-sec', component: PerfilAdminSecComponent },
  { path: 'perfil-docente', component: PerfilDocenteComponent },
  { path: 'perfil-estudiante', component: PerfilEstudianteComponent },
  { path: 'perfil-familia', component: PerfilFamiliaComponent },
  { path: '**', redirectTo: '' } // Redirección para rutas no válidas
];