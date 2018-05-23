/**
 * Created by harold on 5/3/18.
 */


import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PATHS} from "../../../@core/config/constanst";
import {ServerResponse} from "../../../@core/utils/ServerResponse";

@Injectable()

export class OficinaService {


  constructor(private http: HttpClient) {}

  getAllOffices(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=office&m=get_all_offices');
  }

  createOffice(data): Observable<any> {
    return this.http.post(PATHS.API + '&c=office&m=office_create', JSON.stringify(data));
  }

  updateOffice(data): Observable<any> {
    return this.http.post(PATHS.API + '&c=office&m=office_update', JSON.stringify(data));
  }

  deleteOffice(data): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=office&m=office_delete', JSON.stringify(data));
  }

}
