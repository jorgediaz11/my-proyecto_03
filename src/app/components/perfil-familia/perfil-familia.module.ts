import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilFamiliaComponent } from './perfil-familia.component';
//import { HijosFamiliaComponent } from './opciones/hijos-familia/hijos-familia.component';
//import { NotasFamiliaComponent } from './opciones/notas-familia/notas-familia.component';
// ...otros componentes

import { routes } from './perfil-familia.routes';

@NgModule({
  declarations: [
    //HijosFamiliaComponent,
    //NotasFamiliaComponent,
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilFamiliaComponent,
    // ...otros módulos necesarios
    // Si tienes componentes standalone, agrégalos aquí
  ]
})
export class PerfilFamiliaModule {}