import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule, // Importa el módulo principal de la aplicación
    ServerModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
  // Lógica específica del componente
}