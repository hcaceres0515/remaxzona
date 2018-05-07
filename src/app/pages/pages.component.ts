import {Component, OnInit} from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {HttpClient} from "@angular/common/http";
import {PATHS} from "./config/constanst";
import {PagesMenuService} from "./pages-menu.service";
import {Auth} from "../@theme/auth/models/auth";

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

    // this.http.get(PATHS.API + '&c=user&m=get_rol_menu_by_user&rol_id=3').subscribe(data => {
    //   console.log(data);
    //
    //   this.menuData = data;
    //
    //   this.newMenu.push({
    //     title: 'Inicio',
    //     icon: 'ion-disc',
    //     link: '/pages/dashboard',
    //     home: true
    //   });
    //
    //   Object.keys(this.menuData.data).forEach((value) => {
    //
    //     const item = this.menuData.data[value];
    //
    //     if (item.children !== undefined) {
    //
    //       const CHILD_MENU = [];
    //
    //       Object(item.children).forEach((child) => {
    //         CHILD_MENU.push({
    //           title: child.title,
    //           link: ''
    //         });
    //       });
    //
    //       this.newMenu.push({
    //         title: item.title,
    //         icon: item.icon,
    //         link: '/pages/ui-features',
    //         children: CHILD_MENU
    //       });
    //     } else {
    //       this.newMenu.push({
    //         title: item.title,
    //         icon: item.icon,
    //         link: '/pages/ui-features'
    //       });
    //     }
    //   });
    //
    //   console.log(this.newMenu);
    //
    //   this.menu = this.newMenu;
    //
    // });
    let auth: Auth;
    auth = JSON.parse(localStorage.getItem("auth"));
    console.log(auth.rol_id);
    this.getMenuByRol(auth.rol_id);
  }

  getMenuByRol(rolId) {

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

          if (item.children !== undefined) {

            const CHILD_MENU = [];

            Object(item.children).forEach((child) => {
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

      }
    )

  }

}
