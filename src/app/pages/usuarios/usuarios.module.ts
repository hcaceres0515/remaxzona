import {SmartTableService} from "../../@core/data/smart-table.service";
import {ThemeModule} from "../../@theme/theme.module";
import {UsuariosRoutingModule} from "./usuarios-routing.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {UsuariosComponent} from "./usuarios.component";
import {NgModule} from "@angular/core";
import {ActionsMisUsuariosTable, MisUsuariosComponent} from "./mis-usuarios/mis-usuarios.component";
import {UsuariosService} from "./usuarios.service";
import {AddUsuarioModalComponent} from "./mis-usuarios/add-usuario-modal.component";
import {OficinaService} from "../configuracion/oficinas/oficina.service";
import {RolesService} from "../configuracion/roles/roles.service";
import {ToasterModule} from "angular2-toaster";
/**
 * Created by harold on 5/12/18.
 */


@NgModule({

  imports: [
    ThemeModule,
    UsuariosRoutingModule,
    Ng2SmartTableModule,
    ToasterModule
  ],
  declarations: [
    UsuariosComponent,
    MisUsuariosComponent,
    AddUsuarioModalComponent,
    ActionsMisUsuariosTable
  ],
  entryComponents: [
    AddUsuarioModalComponent,
    ActionsMisUsuariosTable
  ],
  providers: [
    UsuariosService,
    OficinaService,
    RolesService
  ]
})



export  class UsuariosModule {}
