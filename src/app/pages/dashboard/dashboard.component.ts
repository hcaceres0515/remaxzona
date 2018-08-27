import {Component, OnInit} from '@angular/core';
import {DashboardService} from "./dashboard.service";

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  captadores: any = [];
  vendedores: any = [];
  ingresos: any = [];

  lastProperties: any = [];

  constructor(private dashboardService: DashboardService){}

  ngOnInit() {

    this.dashboardService.getRankingUsers().subscribe(
      (response) => {
        let data: any = response.data;
        this.captadores = data.captadores;
        this.vendedores = data.vendedores;
        this.ingresos = data.ingresos;
      },
      (error) => {},
      () => {}
    );

    this.dashboardService.getLastProperties().subscribe(
      (response) => {
        this.lastProperties = response.data;
      },
      (error) => {},
      () => {}
    );
  }

}
