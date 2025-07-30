/* Estilo global para enlaces 005 */
import { Component, inject } from '@angular/core';  // Importar el decorador Component de Angular
import { LoadingService } from './services/loading.service';

// Importar el módulo de enrutamiento
@Component({
  selector: 'app-root',                 // Selector del componente
  templateUrl: './app.component.html',  // Archivo HTML del componente
  styleUrls: ['./app.component.css']    // Archivo CSS del componente
})
// Clase principal de la aplicación
export class AppComponent {
  // ✅ Inyección del LoadingService
  private loadingService = inject(LoadingService);

  // ✅ Observable para el estado de loading
  public loading$ = this.loadingService.loading$;

  // Lógica específica del componente
  title = 'My Proyecto 02: Back + Front'; // Título de la aplicación
}
