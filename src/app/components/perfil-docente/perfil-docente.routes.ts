import { Routes } from '@angular/router';
import { PerfilDocenteComponent } from './perfil-docente.component';
import { EstudiantesComponent } from './opciones/estudiantes/estudiantes.component';
//import { ClasesComponent } from './opciones/clases/clases.component';
// ...otros componentes del perfil

export const routes: Routes = [
  {
    path: '',
    component: PerfilDocenteComponent,
    children: [
      { path: 'estudiantes', component: EstudiantesComponent },
      //{ path: 'clases', component: ClasesComponent },
      // ...otras rutas internas
    ]
  }
];