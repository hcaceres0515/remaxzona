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

    let menu = JSON.parse(localStorage.getItem('menu'));
    // console.log('canActivate',menu);
    // console.log(state.url);

    console.log('AuthGuardService');

    if (!this.AuthService.isLogged()) {
      this.router.navigateByUrl('/auth/login');
      return false;
    }

    if (state.url === '/pages/dashboard') {
      return true;
    }

    if (state.url === '/pages/propierties/editar-propiedad') {
      return true;
    }

    if (menu.indexOf(state.url) === -1) {
      console.log('You can not access to this page ' + state.url);
      this.router.navigate(['/pages/dashboard']);
    }

    return true;
  }



}
