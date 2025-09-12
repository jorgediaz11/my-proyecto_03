import { Routes } from '@angular/router';
import { PerfilAdminSecComponent } from './perfil-admin-sec.component';
import { DocentesComponent } from './opciones/docentes/docentes.component';
import { EstudiantesComponent } from './opciones/estudiantes/estudiantes.component';
// ...otros componentes del perfil

export const routes: Routes = [
  {
    path: '',
    component: PerfilAdminSecComponent,
    children: [
      { path: 'docentes', component: DocentesComponent },
      { path: 'estudiantes', component: EstudiantesComponent },
      // ...otras rutas internas
    ]
  }
];