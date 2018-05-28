/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';

import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Auth} from "../../models/auth";
import {PATHS} from "../../../../@core/config/constanst";


@Component({
  selector: 'nb-login',
  template: `
    <nb-auth-block>
      <h2 class="title">SOFTREMA</h2>
      <small class="form-text sub-title">Ingrese con su email corporativo de Remax Zona</small>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">

        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div><strong>Oh snap!</strong></div>
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div><strong>Hooray!</strong></div>
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-email" class="sr-only">Email address</label>
          <input name="email" [(ngModel)]="user.email" id="input-email" pattern=".+@.+\..+"
                 class="form-control" placeholder="email@remaxzona.com" #email="ngModel"
                 [class.form-control-danger]="email.invalid && email.touched" autofocus
                 [required]="getConfigValue('forms.validation.email.required')"
                 [disabled]="disabledInputs">
          <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
            Email es requerido!
          </small>
          <small class="form-text error"
                 *ngIf="email.invalid && email.touched && email.errors?.pattern">
            Email debe ser una dirección válida
          </small>
        </div>

        <div class="form-group">
          <label for="input-password" class="sr-only">Password</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="Password" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')"
                  [disabled]="disabledInputs">
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            Password es requerido!
          </small>
          <small
            class="form-text error" 
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)" >
            Password debe contener
            de {{ getConfigValue('forms.validation.password.minLength') }}
            hasta {{ getConfigValue('forms.validation.password.maxLength') }}
            caracteres
          </small>
        </div> 
        
        <div class="form-group">
          <p class="text-danger">{{messageError}}</p>
        </div>
        
        <div class="form-group" *ngIf="userRoles.length > 1">

          <div class="form-group">
            
            <label>Rol</label>
            <select name="roldId" class="form-control" [(ngModel)]="user.rolId">
              <option  *ngFor="let item of userRoles" value="{{item.rol_id}}">{{item.description}}</option>              
            </select>
          </div>
          
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted" *ngIf="userRoles.length == 0">
          INICIAR SESION
        </button>      
                
      </form>

      <button (click)="enter()" *ngIf="userRoles.length > 1" class="btn btn-block btn-hero-success">
        INGRESAR
      </button>

      
    </nb-auth-block>
  `,
})
export class NbLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];

  userRoles: any = [];

  disabledInputs: boolean = false;

  auth: Auth;

  messageError: string = "";

  constructor(protected service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected config = {},
              protected router: Router,
              private _http: HttpClient) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');

    if (this.service.isLogged()) {
      this.router.navigateByUrl('/pages/dashboard');
    }

  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.messageError = "";
    // console.log(this.user);

    // this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
    //   this.submitted = false;
    //
    //   if (result.isSuccess()) {
    //     this.messages = result.getMessages();
    //   } else {
    //     this.errors = result.getErrors();
    //   }
    //
    //   const redirect = result.getRedirect();
    //   if (redirect) {
    //     setTimeout(() => {
    //       return this.router.navigateByUrl(redirect);
    //     }, this.redirectDelay);
    //   }
    // });

    let headers = new HttpHeaders({ 'Client-Service': 'remaxzona-client', 'Auth-Key': 'remaxzonaapi', 'Content-Type': 'application/json' });
    // let headers = new Headers({ 'Client-Service': 'remaxzona-client', 'Auth-Key': 'remaxzonaapi', 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers, method: 'post'});
    this.submitted = false;
    this._http.post(PATHS.API + '&c=auth&m=login', JSON.stringify(this.user), {headers: headers}).subscribe(data => {

      let response: any = data;

      let now = new Date().getTime();
      this.auth = new Auth(response.id, response.office_id,0, response.token, now);

      //localStorage.setItem('auth', JSON.stringify(auth));

      this._http.get(PATHS.API + '&c=user&m=get_user_rol&user_id=' + this.auth.user_id, {headers: headers}).subscribe(

        data => {
          let response: any = data;

          if (response.data.length == 1) {
            this.user.rolId = response.data[0].rol_id;
            this.enter();
          } else {

            this.userRoles = response.data;
            this.user.rolId = this.userRoles[0].rol_id;
            this.disabledInputs = true;
          }
        }
      );
    },
    error => {
      if (error instanceof HttpErrorResponse) {

        if (error.status === 400 ){
          this.messageError = error.error.message;
        }
      }
    }
    );
  }

  enter() {

   this.auth.rol_id = this.user.rolId;
   localStorage.setItem('auth', JSON.stringify(this.auth));
   this.router.navigateByUrl('/pages/dashboard');
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
