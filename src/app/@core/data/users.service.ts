import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PATHS} from "../config/constanst";
import {NbAuthService} from "../../@theme/auth/services/auth.service";

let counter = 0;

@Injectable()
export class UserService {

  private users = {
    nick: { name: 'Nick Jones', picture: 'assets/images/nick.png'},
    eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
  };

  private user: any[];
  private userArray: any[];

  public userRoles: any = [];

  private userId;
  private headers;

  constructor(private http: HttpClient, private AuthService: NbAuthService) {
    // this.userArray = Object.values(this.users);

    console.log('init user service', JSON.parse(localStorage.getItem('auth')));
    this.userId = this.AuthService.getUserId();

    this.headers = new HttpHeaders({ 'Client-Service': 'remaxzona-client', 'Auth-Key': 'remaxzonaapi', 'Content-Type': 'application/json', 'Authorization': this.AuthService.getUserToken(),
      'User-ID': this.AuthService.getUserId() });


  }

  getUserRoles(): Observable<any[]> {
    return this.http.get(PATHS.API + '&c=user&m=get_user_rol&user_id=' + this.userId, {headers: this.headers});
  }

  getUsers(): Observable<any> {
    return Observable.of(this.users);
  }

  getUserInfo(): Observable<any> {

    return this.http.get(PATHS.API + '&c=user&m=get_user_info&user_id=' + this.userId, {headers: this.headers});
    // return Observable.of(this.users);
  }

  // getUserArray(): Observable<any[]> {
  //   return Observable.of(this.userArray);
  // }
  //
  // getUser(): Observable<any> {
  //   counter = (counter + 1) % this.userArray.length;
  //   return Observable.of(this.userArray[counter]);
  // }
}
