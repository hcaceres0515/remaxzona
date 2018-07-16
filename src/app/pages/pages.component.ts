import {Component, OnInit} from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {HttpClient} from "@angular/common/http";
import {PATHS} from "../@core/config/constanst";
import {PagesMenuService} from "./pages-menu.service";
import {Auth} from "../@theme/auth/models/auth";
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit{

  menu = MENU_ITEMS;
  newMenu = [];

  menuData: any;

  constructor(private http: HttpClient, private _pagesMenuService: PagesMenuService){}

  ngOnInit() {
    let auth: Auth;
    auth = JSON.parse(localStorage.getItem("auth"));
    this.getMenuByRol(auth.rol_id);
  }

  getMenuByRol(rolId) {

    let PATH_MENU = [];

    this._pagesMenuService.getMenu(rolId).subscribe(
      data => this.menuData = (data),
      error => {},
      () => {
        this.newMenu.push({
          title: 'Inicio',
          icon: 'ion-disc',
          link: '/pages/dashboard',
          home: true
        });

        Object.keys(this.menuData.data).forEach((value) => {

          const item = this.menuData.data[value];

          PATH_MENU.push(item.path);

          if (item.children !== undefined) {

            const CHILD_MENU = [];

            Object(item.children).forEach((child) => {
              PATH_MENU.push(child.path);
              CHILD_MENU.push({
                title: child.title,
                link: child.path
              });
            });

            this.newMenu.push({
              title: item.title,
              icon: item.icon,
              link: item.path,
              children: CHILD_MENU
            });
          } else {
            this.newMenu.push({
              title: item.title,
              icon: item.icon,
              link: item.path
            });
          }
        });

        this.menu = this.newMenu;

        localStorage.setItem('menu', JSON.stringify(PATH_MENU));

      }
    )

  }

}
