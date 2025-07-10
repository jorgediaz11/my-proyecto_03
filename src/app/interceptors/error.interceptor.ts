import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        const shouldShowNotification = true;

        console.error('🚨 HTTP Error intercepted:', error);

        if (error.error instanceof ErrorEvent) {
          // ✅ Error del lado del cliente
          errorMessage = `Error del cliente: ${error.error.message}`;
          console.error('Client-side error:', error.error.message);
        } else {
          // ✅ Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud incorrecta. Verifica los datos ingresados.';
              break;

            case 401:
              errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              this.handleUnauthorized();
              break;

            case 403:
              errorMessage = 'No tienes permisos para realizar esta acción.';
              break;

            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;

            case 409:
              errorMessage = error.error?.message || 'El recurso ya existe o hay un conflicto.';
              break;

            case 422:
              errorMessage = error.error?.message || 'Datos de validación incorrectos.';
              break;

            case 429:
              errorMessage = 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.';
              break;

            case 500:
              errorMessage = 'Error interno del servidor. Contacta al administrador.';
              break;

            case 502:
              errorMessage = 'Servidor no disponible. Intenta nuevamente más tarde.';
              break;

            case 503:
              errorMessage = 'Servicio temporalmente no disponible.';
              break;

            case 0:
              errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
              break;

            default:
              errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
          }

          console.error(`Server-side error: ${error.status} - ${error.statusText}`);
        }

        // ✅ Mostrar notificación solo si no es un error 401 (que se maneja por separado)
        if (shouldShowNotification && error.status !== 401) {
          this.showErrorNotification(errorMessage);
        }

        // ✅ Crear objeto de error estructurado
        const errorObj = {
          message: errorMessage,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          timestamp: new Date().toISOString()
        };

        return throwError(() => errorObj);
      })
    );
  }

  // ✅ Manejo específico de errores 401
  private handleUnauthorized(): void {
    // Limpiar token y datos de sesión
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    // Mostrar notificación específica
    Swal.fire({
      icon: 'warning',
      title: 'Sesión Expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      confirmButtonColor: '#f59e0b',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(() => {
      // Redireccionar al login
      this.router.navigate(['/login']);
    });
  }

  // ✅ Mostrar notificación de error
  private showErrorNotification(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#dc3545',
      timer: 5000,
      timerProgressBar: true
    });
  }
}
