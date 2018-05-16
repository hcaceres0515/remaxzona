/**
 * Created by harold on 5/3/18.
 */


import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PATHS} from "../../../@core/config/constanst";
import {ServerResponse} from "../../../@core/utils/ServerResponse";

@Injectable()

export class RolesService {


  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=rol&m=get_all_roles');
  }

  getAllMenu(): Observable<any[]> {
    return this.http.get(PATHS.API + '&c=rol&m=get_all_menu');
  }

  getRolMenu(rolId): Observable<any[]> {
    return this.http.get(PATHS.API + '&c=rol&m=get_rol_menu&rol_id='+rolId);
  }

  updateRolMenu(data) {
    return this.http.post(PATHS.API + '&c=rol&m=update_rol_menu', data);
  }
}
