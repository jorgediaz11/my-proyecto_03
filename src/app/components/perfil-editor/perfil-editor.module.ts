import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilEditorComponent } from './perfil-editor.component';
//import { LibrosEditorComponent } from './opciones/libros-editor/libros-editor.component';
//import { ActividadesEditorComponent } from './opciones/actividades-editor/actividades-editor.component';
// ...otros componentes

import { routes } from './perfil-editor.routes';

@NgModule({
  declarations: [
    //LibrosEditorComponent,
    //ActividadesEditorComponent,
    // ...otros componentes NO standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PerfilEditorComponent,
    // ...otros módulos necesarios
    // Si tienes componentes standalone, agrégalos aquí
  ]
})
export class PerfilEditorModule {}