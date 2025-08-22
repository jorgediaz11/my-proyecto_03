import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';   /* revisar */

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  // ✅ Endpoints que NO deben ser loggeados (por volumen o sensibilidad)
  private excludedEndpoints = [
    '/auth/refresh',
    '/api/health',
    '/api/ping'
  ];

  // ✅ Solo loggear en desarrollo
  private isProduction = false; // Cambiar según el ambiente

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // ✅ Verificar si debe ser excluido del logging
    const shouldExclude = this.excludedEndpoints.some(endpoint =>
      req.url.includes(endpoint)
    );

    if (shouldExclude || this.isProduction) {
      return next.handle(req);
    }

    // ✅ Registrar inicio de request
    const startTime = Date.now();
    console.group(`🌐 HTTP Request: ${req.method} ${req.url}`);
    console.log('📤 Request Details:', {
      method: req.method,
      url: req.url,
      headers: this.sanitizeHeaders(req.headers),
      body: req.body ? 'Present' : 'None',
      timestamp: new Date().toISOString()
    });

    return next.handle(req).pipe(
      tap(event => {
        // ✅ Loggear solo las respuestas HTTP
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log('📥 Response Details:', {
            status: event.status,
            statusText: event.statusText,
            duration: `${duration}ms`,
            size: event.body ? JSON.stringify(event.body).length : 0,
            timestamp: new Date().toISOString()
          });

          // ✅ Alertar sobre respuestas lentas
          if (duration > 3000) {
            console.warn(`⚠️ Slow response: ${duration}ms for ${req.method} ${req.url}`);
          }
        }
      }),
      catchError(error => {
        const duration = Date.now() - startTime;
        console.error('❌ HTTP Error Details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });

        // ✅ Loggear errores específicos
        if (error.status === 0) {
          console.error('🔌 Network Error: Check internet connection');
        } else if (error.status >= 500) {
          console.error('🚨 Server Error: Backend issue detected');
        } else if (error.status === 401) {
          console.error('🔐 Authentication Error: Token might be expired');
        }

        return throwError(() => error);
      }),
      tap({ complete: () => console.groupEnd() })
    );
  }

  // ✅ Sanitizar headers sensibles
  private sanitizeHeaders(headers: HttpRequest<unknown>['headers']): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];

    headers.keys().forEach((key: string) => {
      const lowerKey = key.toLowerCase();
      if (sensitiveHeaders.includes(lowerKey)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = headers.get(key) || '';
      }
    });

    return sanitized;
  }
}
