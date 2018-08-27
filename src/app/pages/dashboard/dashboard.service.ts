/**
 * Created by harold on 8/26/18.
 */

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {ServerResponse} from "../../@core/utils/ServerResponse";
import {PATHS} from "../../@core/config/constanst";
@Injectable()

export class DashboardService {

  constructor(private http: HttpClient) {

  }

  getRankingUsers(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=user&m=get_ranking_user');
  }

  getLastProperties(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_last_properties');
  }
}
