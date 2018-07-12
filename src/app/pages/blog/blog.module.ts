
import {NgModule} from "@angular/core";
import {ThemeModule} from "../../@theme/theme.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {ToasterModule} from "angular2-toaster";
import {BlogRoutingModule} from "./blog-routing.module";
import {BlogComponent} from "./blog.component";
import {BlogCategoriaComponent} from "./categorias/categorias.component";
import {BlogPublicacionComponent} from "./publicaciones/publicaciones.component";

@NgModule({
  imports: [
    ThemeModule,
    BlogRoutingModule,
    Ng2SmartTableModule,
    ToasterModule
  ],
  declarations: [
    BlogComponent,
    BlogCategoriaComponent,
    BlogPublicacionComponent
  ],
  entryComponents: [
  ],
  providers: [
  ]
})



export  class BlogModule {}
