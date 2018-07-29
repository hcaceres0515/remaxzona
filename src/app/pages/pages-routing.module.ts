import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthGuardService} from "../@core/utils/auth-guard.service";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'configuracion',
    loadChildren: './configuracion/configuracion.module#ConfiguracionModule',
  },
  {
    path: 'usuarios',
    loadChildren: './usuarios/usuarios.module#UsuariosModule',
  },
  {
    path: 'clientes',
    loadChildren: './clientes/clientes.module#ClientesModule',
  },
  {
    path: 'propiedades',
    loadChildren: './propiedades/propiedades.module#PropiedadesModule',
  },
  {
    path: 'blog',
    loadChildren: './blog/blog.module#BlogModule',
  },
  {
    path: 'web',
    loadChildren: './web/web.module#WebModule',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {

  constructor() {
  }

}
