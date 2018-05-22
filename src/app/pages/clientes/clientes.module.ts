/**
 * Created by harold on 5/15/18.
 */


import {ThemeModule} from "../../@theme/theme.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {NgModule} from "@angular/core";
import {OficinaService} from "../configuracion/oficinas/oficina.service";
import {RolesService} from "../configuracion/roles/roles.service";
import {ClientesComponent} from "./clientes.component";
import {ClientesRoutingModule} from "./clientes-routing.module";
import {ActionsClientesTable, MisClientesComponent} from "./mis-clientes/mis-clientes.component";
import {AddClientesModalComponent} from "./mis-clientes/add-clientes-modal.component";
import {ClientesService} from "./clientes.service";
import {ToasterModule} from "angular2-toaster";
/**
 * Created by harold on 5/12/18.
 */


@NgModule({

  imports: [
    ThemeModule,
    ClientesRoutingModule,
    Ng2SmartTableModule,
    ToasterModule
  ],
  declarations: [
    ClientesComponent,
    MisClientesComponent,
    AddClientesModalComponent,
    ActionsClientesTable
  ],
  entryComponents: [
    AddClientesModalComponent,
    ActionsClientesTable
  ],
  providers: [
    RolesService,
    ClientesService
  ]
})



export  class ClientesModule {}
