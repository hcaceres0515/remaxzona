/**
 * Created by harold on 5/1/18.
 */


import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {NbAuthService} from "../../@theme/auth/services/auth.service";
@Injectable()

export class AuthGuardService implements CanActivate {

  constructor(public AuthService: NbAuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean>
    | Promise<boolean>
    | boolean {

    if (!this.AuthService.isLogged()) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
    return true;
  }



}
