import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

// Importar el módulo de enrutamiento
@NgModule({
  imports: [
    AppModule,        // Importa el módulo principal de la aplicación
    ServerModule      // Importa el módulo del servidor
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
  // Lógica específica del componente
}
