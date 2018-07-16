/**
 * Created by harold on 5/1/18.
 */

import {Injectable} from "@angular/core";
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs";
import {NbAuthService} from "../../@theme/auth/services/auth.service";
import {Router} from "@angular/router";

@Injectable()

export class HttpClientInterceptor implements HttpInterceptor {

  constructor(public AuthService: NbAuthService, public router: Router){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if (!request.headers.has('Content-Type')) {
    //   request.clone({
    //     setHeaders: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    // }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'Client-Service': 'remaxzona-client',
          'Auth-Key': 'remaxzonaapi',
          // 'Content-Type': 'application/json',
          'Authorization': this.AuthService.getUserToken(),
          'User-ID': this.AuthService.getUserId()
        }
      });
    }

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse){

      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigateByUrl('/auth/login');
          window.location.reload();
        }
      }
    });

  }

}
