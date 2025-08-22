// The TypeScript configuration file used in this project is : tsconfig.json
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'flowbite';  // Importar Flowbite para estilos y componentes adicionales

// Importar el módulo de enrutamiento
if (environment.production) {
  enableProdMode();                     // Importar el módulo de enrutamiento 03b
}
// Importar el módulo de enrutamiento
platformBrowserDynamic()                // Inicializa la aplicación Angular
  .bootstrapModule(AppModule)           // Importar el módulo de enrutamiento 03b
  .catch((err) => console.error(err));  // Importar el módulo de enrutamiento 03b
