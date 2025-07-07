import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(`🌐 HTTP Request: ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap(
        event => console.log(`✅ HTTP Response: ${req.method} ${req.url}`, event),
        error => console.error(`❌ HTTP Error: ${req.method} ${req.url}`, error)
      )
    );
  }
}
