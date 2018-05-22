import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PATHS} from "../../@core/config/constanst";
import {ServerResponse} from "../../@core/utils/ServerResponse";
import {Injectable} from "@angular/core";
/**
 * Created by harold on 5/15/18.
 */

@Injectable()
export class ClientesService {

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=customer&m=get_all_customers');
  }

  getCustomerByOffice(officeId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=customer&m=get_customers_by_office&office_id=' + officeId);
  }

  getCustomerByUser(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=customer&m=get_customers_by_user&user_id=' + userId);
  }

  createCustomer(data): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=customer&m=customer_create', JSON.stringify(data));
  }

  updateCustomer(data): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=customer&m=customer_update', JSON.stringify(data));
  }

  deleteCustomer(data): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=customer&m=customer_delete', JSON.stringify(data));
  }

  checkCustomerExist(identityNumber, email): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=customer&m=check_customer_exist&identity_number='+ identityNumber +'&email=' + email);
  }

  getCustomerTypes() {

    let obj = [
      {
        id: '1',
        name: 'Vendedor'
      },
      {
        id: '2',
        name: 'Comprador'
      }
    ];

    return obj;
  }

}
