import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  // ✅ Endpoints que NO deben mostrar loading global
  private excludedEndpoints = [
    '/auth/refresh',
    '/auth/heartbeat',
    '/api/health',
    '/api/ping'
  ];

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // ✅ Verificar si el endpoint debe ser excluido
    const shouldExclude = this.excludedEndpoints.some(endpoint =>
      req.url.includes(endpoint)
    );

    // ✅ Verificar si la request tiene header personalizado para excluir loading
    const skipLoading = req.headers.has('X-Skip-Loading');

    if (shouldExclude || skipLoading) {
      return next.handle(req);
    }

    // ✅ Iniciar loading
    this.loadingService.startLoading();

    return next.handle(req).pipe(
      finalize(() => {
        // ✅ Detener loading cuando termine la request
        this.loadingService.stopLoading();
      })
    );
  }
}
