import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PATHS} from "../../@core/config/constanst";
import {ServerResponse} from "../../@core/utils/ServerResponse";
/**
 * Created by harold on 5/15/18.
 */


export class ClientesService {

  constructor(private http: HttpClient) {}

  getCustomerByUser(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=office&m=get_all_offices');
  }

}
