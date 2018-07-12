import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BlogComponent} from "./blog.component";
import {AuthGuardService} from "../../@core/utils/auth-guard.service";
import {BlogCategoriaComponent} from "./categorias/categorias.component";
import {BlogPublicacionComponent} from "./publicaciones/publicaciones.component";
/**
 * Created by harold on 7/11/18.
 */

const routes: Routes = [{
  path: '',
  component: BlogComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: 'categorias',
    component: BlogCategoriaComponent,
  },
    {
      path: 'publicaciones',
      component: BlogPublicacionComponent,
    }
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BlogRoutingModule {}

