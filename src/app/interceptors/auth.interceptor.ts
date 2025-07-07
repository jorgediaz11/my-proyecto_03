import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Excluir endpoints de autenticación del interceptor
    const isAuthEndpoint = req.url.includes('/auth/signin') ||
                          req.url.includes('/auth/signup') ||
                          req.url.includes('/auth/check-user');

    if (isAuthEndpoint) {
      return next.handle(req);
    }

    // Agregar token JWT a requests que lo requieren
    const token = localStorage.getItem('access_token');

    if (token) {
      const reqWithHeader = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(reqWithHeader);
    }

    return next.handle(req);
  }
}
