import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export default function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const isAuthEndpoint = req.url.includes('/auth/signin') || req.url.includes('/auth/signup');
  
  if (isAuthEndpoint) return next(req);

  const token = localStorage.getItem('access_token');
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(reqWithHeader);
}