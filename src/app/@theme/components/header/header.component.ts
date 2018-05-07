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

  userMenu = [{ title: 'Perfil', slug: 'profile' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private AuthService: NbAuthService,
              public router: Router) {
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);

    let roles = [];

    this.userService.getUserRoles()
      .subscribe((usersRol: any[]) => {
        roles = usersRol;
        console.log('Roles', roles);
        roles.forEach((item)=> {
          if (this.user.rol_name != item.name){
            this.userMenu.push({title: item.description, slug: item.name});
          }
        })

        this.userMenu.push({title: 'Salir', slug: 'logout'});

    });



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
    }
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
