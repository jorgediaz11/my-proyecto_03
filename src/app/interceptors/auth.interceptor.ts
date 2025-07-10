import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);

  // ✅ Endpoints que NO requieren autenticación
  private publicEndpoints = [
    '/auth/signin',
    '/auth/signup',
    '/auth/login',
    '/auth/register',
    '/auth/check-user',
    '/auth/forgot-password',
    '/auth/verify-reset-token',
    '/auth/reset-password',
    '/api/health',
    '/api/ping'
  ];

  // ✅ Endpoints que requieren headers específicos
  private apiEndpoints = [
    '/api/users',
    '/api/colegios',
    '/api/estudiantes',
    '/api/docentes',
    '/api/perfiles'
  ];

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // ✅ Verificar si es un endpoint público
    const isPublicEndpoint = this.publicEndpoints.some(endpoint =>
      req.url.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log('🔓 Public endpoint, skipping auth:', req.url);
      return next.handle(req);
    }

    // ✅ Obtener token del localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.warn('⚠️ No token found, redirecting to login');
      this.router.navigate(['/login']);
      return next.handle(req);
    }

    // ✅ Verificar si el token está expirado (opcional)
    if (this.isTokenExpired(token)) {
      console.warn('⚠️ Token expired, redirecting to login');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      return next.handle(req);
    }

    // ✅ Clonar request y agregar headers de autenticación
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // ✅ Agregar headers específicos para endpoints de API
    const isApiEndpoint = this.apiEndpoints.some(endpoint =>
      req.url.includes(endpoint)
    );

    if (isApiEndpoint) {
      console.log('🔐 API endpoint with auth:', req.url);
    }

    return next.handle(authReq);
  }

  // ✅ Verificar si el token está expirado
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Si no se puede parsear, considerar como expirado
    }
  }
}
