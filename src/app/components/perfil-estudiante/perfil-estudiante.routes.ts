import { Routes } from '@angular/router';
import { PerfilEstudianteComponent } from './perfil-estudiante.component';
import { ClasesColComponent } from './opciones/clases-col/clases-col.component';
//import { CalificacionesEstudianteComponent } from './opciones/calificaciones/calificaciones.component';
// ...otros componentes del perfil

export const routes: Routes = [
  {
    path: '',
    component: PerfilEstudianteComponent,
    children: [
      { path: 'clases-col', component: ClasesColComponent },
      //{ path: 'calificaciones', component: CalificacionesEstudianteComponent },
      // ...otras rutas internas
    ]
  }
];