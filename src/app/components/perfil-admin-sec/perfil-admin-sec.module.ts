import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilAdminSecComponent } from './perfil-admin-sec.component';
import { DocentesComponent } from './opciones/docentes/docentes.component';
import { EstudiantesComponent } from './opciones/estudiantes/estudiantes.component';
// ...otros componentes

import { routes } from './perfil-admin-sec.routes';

@NgModule({
  declarations: [
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilAdminSecComponent,
    DocentesComponent,
    EstudiantesComponent,
    // ...otros módulos necesarios
    // Si tienes componentes standalone, agrégalos aquí
  ]
})
export class PerfilAdminSecModule {}