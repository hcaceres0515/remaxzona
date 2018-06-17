import {AuthGuardService} from "../../@core/utils/auth-guard.service";
import {PropiedadesComponent} from "./propiedades.component";
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SubirPropiedadComponent} from "./subir-propiedad/subir-propiedad.component";
import {MisPropiedadesComponent} from "./mis-propiedades/mis-propiedades.component";
import {PropiedadesDesactivadasComponent} from "./desactivadas/propiedades-desactivadas.component";
/**
 * Created by harold on 6/3/18.
 */

const routes: Routes = [{
  path: '',
  component: PropiedadesComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: 'subir-propiedad',
    component: SubirPropiedadComponent,
  },
  {
    path: 'mis-propiedades',
    component: MisPropiedadesComponent,
  },
  {
    path: 'desactivadas',
    component: PropiedadesDesactivadasComponent,
  }
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PropiedadesRoutingModule {}
