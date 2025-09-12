import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilEstudianteComponent } from './perfil-estudiante.component';
import { ClasesColComponent } from './opciones/clases-col/clases-col.component';
//import { CalificacionesEstudianteComponent } from './opciones/calificaciones-estudiante/calificaciones-estudiante.component';
// ...otros componentes

import { routes } from './perfil-estudiante.routes';

@NgModule({
  declarations: [
    //CalificacionesEstudianteComponent,
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilEstudianteComponent,
    ClasesColComponent,
    // ...otros módulos necesarios
    // Si tienes componentes standalone, agrégalos aquí
  ]
})
export class PerfilEstudianteModule {}