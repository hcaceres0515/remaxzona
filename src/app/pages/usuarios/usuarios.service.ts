/**
 * Created by harold on 5/12/18.
 */


import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PATHS} from "../../@core/config/constanst";
import {ServerResponse} from "../../@core/utils/ServerResponse";

@Injectable()

export class UsuariosService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get(PATHS.API + '&c=user&m=get_all_users');
  }

  getUsersByOffice(office_id): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=user&m=get_users_by_office&office_id=' + office_id);
  }

  createUser(data): Observable<any> {
    return this.http.post(PATHS.API + '&c=user&m=user_create', JSON.stringify(data));
  }

  updateUser(data): Observable<any> {
    return this.http.post(PATHS.API + '&c=user&m=user_update', JSON.stringify(data));
  }

  deleteUser(data): Observable<any> {
    return this.http.post(PATHS.API + '&c=user&m=user_delete', JSON.stringify(data));
  }

  getUserRol(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=user&m=get_user_rol&user_id=' + userId);
  }

  resetPassword(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=user&m=send_new_password&user_id=' + userId);
  }

  getUserInfo(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=user&m=get_user_info&user_id=' + userId);
  }

  uploadProfileImage(data) {
    return this.http.post(PATHS.API + '&c=user&m=upload_image', data);
  }
}

