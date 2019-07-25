import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    @Inject('BASE_API_URL') private baseUrl: string) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // handles absolute http requests
    if (req.url.includes('http')) {
      return next.handle(req);
    }

    // handles requests for assets
    if (req.url.includes('assets')) {
      return next.handle(req);
    }

    // handles entity requests to remote API
    const apiReq = req.clone({url: `${this.baseUrl}/${req.url}`});
    return next.handle(apiReq);
  }
}