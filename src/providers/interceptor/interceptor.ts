import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class InterceptorProvider implements HttpInterceptor {

  constructor(
    public http: HttpClient,
    private injector: Injector,
    private router: Route,
    private storage: Storage) {}

  intercept(req: HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{
    return next.handle(req);
  }

}
