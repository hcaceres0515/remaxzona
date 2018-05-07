import {NgModule} from "@angular/core";
import {ThemeModule} from "../../@theme/theme.module";
import {ConfiguracionRoutingModule} from "./configuracion-routing.module";
import {ConfiguracionComponent} from "./configuracion.component";
import {ActionsOficinaTable, OficinaComponent} from "./oficinas/oficina.component";
import {SmartTableService} from "../../@core/data/smart-table.service";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {ActionsRolesTable, RolesComponent} from "./roles/roles.component";
import {OficinaService} from "./oficinas/oficina.service";
import {AddOficinaModalComponent} from "./oficinas/add-oficina-modal.component";
import {RolesService} from "./roles/roles.service";
import {AssignMenuModalComponent} from "./roles/assign-menu-modal.component";

/**
 * Created by harold on 5/2/18.
 */


@NgModule({

  imports: [
    ThemeModule,
    ConfiguracionRoutingModule,
    Ng2SmartTableModule
  ],
  declarations: [
    ConfiguracionComponent,
    OficinaComponent,
    RolesComponent,
    AddOficinaModalComponent,
    AssignMenuModalComponent,
    ActionsOficinaTable,
    ActionsRolesTable
  ],
  entryComponents: [
    AddOficinaModalComponent,
    AssignMenuModalComponent,
    ActionsOficinaTable,
    ActionsRolesTable
  ],
  providers: [
    SmartTableService,
    OficinaService,
    RolesService
  ]
})



export  class ConfiguracionModule {}
