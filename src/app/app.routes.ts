import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginRegistroComponent } from './components/login-registro/login-registro.component';
import { LoginRecuperaComponent } from './components/login-recupera/login-recupera.component';
import { OpcionesComponent } from './components/opciones/opciones.component';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // Componente inicial
  { path: 'login', component: LoginFormComponent },
  { path: 'login-recupera', component: LoginRecuperaComponent },
  { path: 'login-registro', component: LoginRegistroComponent },
  { path: 'opciones', component: OpcionesComponent },       // Ruta para la página de opciones  
  {
    path: 'perfil-admin-pri',
    loadChildren: () =>
      import('./components/perfil-admin-pri/perfil-admin-pri.module')
        .then(m => m.PerfilAdminPriModule)
  },
  {
    path: 'admin-sec',
    loadChildren: () =>
      import('./components/perfil-admin-sec/perfil-admin-sec.module')
        .then(m => m.PerfilAdminSecModule)
  },
  {
    path: 'docente',
    loadChildren: () =>
      import('./components/perfil-docente/perfil-docente.module')
        .then(m => m.PerfilDocenteModule)
  },
  {
    path: 'estudiante',
    loadChildren: () =>
      import('./components/perfil-estudiante/perfil-estudiante.module')
        .then(m => m.PerfilEstudianteModule)
  },
  {
    path: 'familia',
    loadChildren: () =>
      import('./components/perfil-familia/perfil-familia.module')
        .then(m => m.PerfilFamiliaModule)
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./components/perfil-editor/perfil-editor.module')
        .then(m => m.PerfilEditorModule)
  },
  { path: '**', redirectTo: '' }
];