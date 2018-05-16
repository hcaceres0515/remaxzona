import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {UsuariosComponent} from "./usuarios.component";
import {MisUsuariosComponent} from "./mis-usuarios/mis-usuarios.component";
/**
 * Created by harold on 5/12/18.
 */


const routes: Routes = [{
  path: '',
  component: UsuariosComponent,
  children: [{
    path: 'mis-usuarios',
    component: MisUsuariosComponent,
  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class UsuariosRoutingModule {}
