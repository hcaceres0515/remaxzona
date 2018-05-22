import {ClientesComponent} from "./clientes.component";
import {MisClientesComponent} from "./mis-clientes/mis-clientes.component";
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AuthGuardService} from "../../@core/utils/auth-guard.service";
/**
 * Created by harold on 5/15/18.
 */


const routes: Routes = [{
  path: '',
  component: ClientesComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: 'mis-clientes',
    component: MisClientesComponent,
  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ClientesRoutingModule {}
