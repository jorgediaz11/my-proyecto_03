import { Routes } from '@angular/router';
import { PerfilFamiliaComponent } from './perfil-familia.component';
//import { HijosFamiliaComponent } from './opciones/hijos-familia/hijos-familia.component';
//import { NotasFamiliaComponent } from './opciones/notas-familia/notas-familia.component';
// ...otros componentes del perfil

export const routes: Routes = [
  {
    path: '',
    component: PerfilFamiliaComponent,
    children: [
      //{ path: 'hijos', component: HijosFamiliaComponent },
      //{ path: 'notas', component: NotasFamiliaComponent },
      // ...otras rutas internas
    ]
  }
];