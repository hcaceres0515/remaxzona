import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import {NbAuthService} from "../../auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Perfil', slug: 'profile', rol_id:null }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private AuthService: NbAuthService,
              public router: Router) {
  }

  ngOnInit() {
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);

    this.userService.getUserInfo().subscribe(
      response => {
        this.user = response;
        this.user = this.user.data;
      },
      error => {},
      () => {
        this.getRolInfo();
      }
    );
  }

  getRolInfo() {

    let roles: any = [];

    let roldId = this.AuthService.getRolId();

    this.userService.getUserRoles().subscribe(
      response => {
        roles = response;
        roles = roles.data;
      },
      error => {},
      () => {
        roles.forEach((item)=> {
          if (roldId != item.rol_id){
            this.userMenu.push({title: item.description, slug: item.name, rol_id: item.rol_id});
          } else {
            this.user.rol_description = item.description;
          }
        })
        this.userMenu.push({title: 'Salir', slug: 'logout', rol_id: null});
      }
    )
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  goTo($event) {
    console.log($event);
    if ($event.slug === 'logout') {

      this.AuthService.logoutApp();
      this.router.navigateByUrl('/auth/login');

    } else if ($event.slug !== 'profile') {

      let auth: any;
      auth = JSON.parse(localStorage.getItem('auth'));
      localStorage.removeItem('auth');
      auth.rol_id = $event.rol_id;
      localStorage.setItem('auth', JSON.stringify(auth));
      window.location.reload();

    }
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
