import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OpcionesComponent } from './components/opciones/opciones.component';
import { PerfilAdminPriComponent } from './components/perfil-admin-pri/perfil-admin-pri.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent }, // Ruta para el login
  { path: 'opciones', component: OpcionesComponent }, // Ruta para la página de opciones
  { path: 'perfil-admin-pri', component: PerfilAdminPriComponent }, // Ruta para el perfil de admin
  { path: '**', redirectTo: '' } // Redirección para rutas no válidas
];