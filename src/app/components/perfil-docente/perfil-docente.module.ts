import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilDocenteComponent } from './perfil-docente.component';
import { EstudiantesComponent } from './opciones/estudiantes/estudiantes.component';
//import { ClasesComponent } from './opciones/clases/clases.component';
// ...otros componentes

import { routes } from './perfil-docente.routes';

@NgModule({
  declarations: [
    //ClasesComponent,
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilDocenteComponent,
    EstudiantesComponent,
    // ...otros módulos necesarios
    // Si tienes componentes standalone, agrégalos aquí
  ]
})
export class PerfilDocenteModule {}