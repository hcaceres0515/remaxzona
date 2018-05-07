import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PATHS} from "../../pages/config/constanst";
import {NbAuthService} from "../../@theme/auth/services/auth.service";

let counter = 0;

@Injectable()
export class UserService {

  private users = {
    nick: { name: 'Nick Jones', picture: 'assets/images/nick.png', rol_name: 'admin', rol_description: 'Administrador'},
    eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
  };

  private userArray: any[];
  // public userRoles = [
  //     {
  //       id: "1",
  //       user_id: "2",
  //       rol_id: "2",
  //       status: "1",
  //       name: "admin",
  //       description: "Administrador"
  //     },
  //     {
  //       id: "2",
  //       user_id: "2",
  //       rol_id: "3",
  //       status: "1",
  //       name: "agente",
  //       description: "Agente"
  //     }
  // ];

  public userRoles: any = [];

  constructor(private http: HttpClient, private AuthService: NbAuthService) {
    // this.userArray = Object.values(this.users);

    console.log('init user service');
    let userId = this.AuthService.getUserId();

    let headers = new HttpHeaders({ 'Client-Service': 'remaxzona-client', 'Auth-Key': 'remaxzonaapi', 'Content-Type': 'application/json', 'Authorization': this.AuthService.getUserToken(),
      'User-ID': this.AuthService.getUserId() });

    this.http.get(PATHS.API + '&c=user&m=get_user_rol&user_id=' + userId, {headers: headers}).subscribe(
      data => {
        this.userRoles = data;
        this.userRoles = this.userRoles.data
      },
      error => {},
      () => {
        console.log(this.userRoles);
      }
    );

  }

  getUserRoles(): Observable<any[]> {
    return Observable.of(this.userRoles);
  }

  getUsers(): Observable<any> {
    return Observable.of(this.users);
  }

  getUserArray(): Observable<any[]> {
    return Observable.of(this.userArray);
  }

  getUser(): Observable<any> {
    counter = (counter + 1) % this.userArray.length;
    return Observable.of(this.userArray[counter]);
  }
}
