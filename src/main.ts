import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Importar el módulo de enrutamiento
if (environment.production) {
  enableProdMode();                     // Importar el módulo de enrutamiento 02
}
// Importar el módulo de enrutamiento
platformBrowserDynamic()
  .bootstrapModule(AppModule)           // Importar el módulo de enrutamiento 02
  .catch((err) => console.error(err));  // Importar el módulo de enrutamiento 02
