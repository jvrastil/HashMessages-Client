import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  readonly baseUrl: URL;

  constructor(
    @Inject('BASE_API_URL') private baseUrlString: string) {
    this.baseUrl = new URL(this.baseUrlString);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.keys().length === 0) {
      req.headers.set('Content-Type', 'text/plain');
    }

    // handles absolute http requests
    if (req.url.includes('http')) {
      return next.handle(req);
    }

    // handles requests for assets
    if (req.url.includes('assets')) {
      return next.handle(req);
    }

    // handles entity requests to remote API
    const url = new URL(req.url, this.baseUrl);
    const apiReq = req.clone({url: `${url}`});
    return next.handle(apiReq);
  }
}
