import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCountSubject = new BehaviorSubject<number>(0);
  private loadingCount = 0; // ✅ Contador de requests activos

  // ✅ Observable para que los componentes puedan suscribirse
  public loading$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // ✅ Actualizar el estado de loading basado en el contador
    this.loadingCountSubject.subscribe(count => {
      (this.loading$ as BehaviorSubject<boolean>).next(count > 0);
    });
  }

  // ✅ Iniciar loading (incrementar contador)
  startLoading(): void {
    this.loadingCount++;
    this.loadingCountSubject.next(this.loadingCount);
    console.log(`🔄 Loading started. Active requests: ${this.loadingCount}`);
  }

  // ✅ Detener loading (decrementar contador)
  stopLoading(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    this.loadingCountSubject.next(this.loadingCount);
    console.log(`✅ Loading stopped. Active requests: ${this.loadingCount}`);
  }

  // ✅ Obtener estado actual de loading
  isLoading(): boolean {
    return this.loadingCount > 0;
  }

  // ✅ Forzar reset del loading (útil en casos de error)
  resetLoading(): void {
    this.loadingCount = 0;
    this.loadingCountSubject.next(this.loadingCount);
    console.log('🔄 Loading reset to 0');
  }

  // ✅ Obtener número de requests activos
  getActiveRequestsCount(): number {
    return this.loadingCount;
  }
}
