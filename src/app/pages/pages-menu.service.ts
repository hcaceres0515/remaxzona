/**
 * Created by harold on 4/29/18.
 */


import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {PATHS} from "../@core/config/constanst";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable()

export class PagesMenuService {

  headers: Headers;
  options: RequestOptions;

  // auth = new Auth(2, 1, 2, '$1$dWFjx6O0$RoS8LZdXweFeTff18AjhX/');

  constructor(private _http: HttpClient){



  }

  getMenu(rolId): Observable<any[]> {

    return this._http.get(PATHS.API + '&c=user&m=get_rol_menu_by_user&rol_id=' + rolId);

  }

}
