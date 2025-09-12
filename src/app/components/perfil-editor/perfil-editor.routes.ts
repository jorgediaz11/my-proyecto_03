import { Routes } from '@angular/router';
import { PerfilEditorComponent } from './perfil-editor.component';
//import { LibrosEditorComponent } from './opciones/libros-editor/libros-editor.component';
//import { ActividadesEditorComponent } from './opciones/actividades-editor/actividades-editor.component';
// ...otros componentes del perfil

export const routes: Routes = [
  {
    path: '',
    component: PerfilEditorComponent,
    children: [
      //{ path: 'libros', component: LibrosEditorComponent },
      //{ path: 'actividades', component: ActividadesEditorComponent },
      // ...otras rutas internas
    ]
  }
];