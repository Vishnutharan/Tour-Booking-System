import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor 
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from local storage
    const token = localStorage.getItem('authToken');

    // If token exists, clone the request and add Authorization header
    if (token) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(clonedRequest);
    }

    // If no token, pass the original request
    return next.handle(request);
  }
}