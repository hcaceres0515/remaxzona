import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConfiguracionComponent} from "./configuracion.component";
import {OficinaComponent} from "./oficinas/oficina.component";
import {RolesComponent} from "./roles/roles.component";
import {AuthGuardService} from "../../@core/utils/auth-guard.service";
/**
 * Created by harold on 5/2/18.
 */

const routes: Routes = [{
  path: '',
  component: ConfiguracionComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: 'oficinas',
    component: OficinaComponent,
  },
    {
      path: 'roles',
      component: RolesComponent,
    }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ConfiguracionRoutingModule {}
