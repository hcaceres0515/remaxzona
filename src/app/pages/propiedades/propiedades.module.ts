import {ThemeModule} from "../../@theme/theme.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {ToasterModule} from "angular2-toaster";
import {RolesService} from "../configuracion/roles/roles.service";
import {OficinaService} from "../configuracion/oficinas/oficina.service";
import {NgModule} from "@angular/core";
import {PropiedadesComponent} from "./propiedades.component";
import {PropiedadesRoutingModule} from "./propiedades-routing.module";
import {SubirPropiedadComponent} from "./subir-propiedad/subir-propiedad.component";
import {AgmCoreModule} from "@agm/core";
import {PropertyService} from "./propiedades.service";
import {NguiAutoCompleteModule} from "@ngui/auto-complete";
import {AddClientesModalComponent} from "../clientes/mis-clientes/add-clientes-modal.component";
import {ClientesService} from "../clientes/clientes.service";
import {EditPropertyModalComponent} from "./edit-property-modal.component";
import {MisPropiedadesComponent} from "./mis-propiedades/mis-propiedades.component";
import {GeolocationService} from "../../@core/utils/geolocation/geolocation.service";
import {PropiedadesDesactivadasComponent} from "./desactivadas/propiedades-desactivadas.component";
/**
 * Created by harold on 6/3/18.
 */

@NgModule({

  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    ToasterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkjHH-qFd7miP6TMmw3fqsvzt7S0MkFio',
      libraries: ["places"]
    }),
    PropiedadesRoutingModule,
    // NguiAutoCompleteModule
  ],
  declarations: [
    PropiedadesComponent,
    MisPropiedadesComponent,
    SubirPropiedadComponent,
    PropiedadesDesactivadasComponent,
    EditPropertyModalComponent
  ],
  entryComponents: [
  ],
  providers: [
    OficinaService,
    RolesService,
    PropertyService,
    ClientesService,
    GeolocationService
  ]
})

export  class PropiedadesModule {}
