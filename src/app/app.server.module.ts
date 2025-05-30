import { NgModule } from '@angular/core'; // Importar el módulo de enrutamiento
import { ServerModule } from '@angular/platform-server';  //
import { AppComponent } from './app.component'; // Importar el componente raíz de la aplicación
import { AppModule } from './app.module'; // Importar el módulo principal de la aplicación

// Importar el módulo de enrutamiento
@NgModule({
  imports: [
    AppModule,        // Importa el módulo principal de la aplicación
    ServerModule      // Importa el módulo del servidor
  ],
  bootstrap: [AppComponent] // Componente raíz de la aplicación
})
export class AppServerModule {
  // Lógica específica del componente
}
