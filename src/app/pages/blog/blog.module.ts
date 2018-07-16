
import {NgModule} from "@angular/core";
import {ThemeModule} from "../../@theme/theme.module";
import {Ng2SmartTableModule} from "ng2-smart-table";
import {ToasterModule} from "angular2-toaster";
import {BlogRoutingModule} from "./blog-routing.module";
import {BlogComponent} from "./blog.component";
import {BlogCategoriaComponent} from "./categorias/categorias.component";
import {ActionsBlogPublicacionesTable, BlogPublicacionComponent} from "./publicaciones/publicaciones.component";
import {AddBlogCategoriasComponent} from "./categorias/add-blogcategorias.modal.component";
import {BlogService} from "./blog.service";
import {AddBlogPublicacionesComponent} from "./publicaciones/add-publicaciones-modal.component";
import {CKEditorModule} from "ng2-ckeditor";

@NgModule({
  imports: [
    ThemeModule,
    BlogRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    CKEditorModule
  ],
  declarations: [
    BlogComponent,
    BlogCategoriaComponent,
    BlogPublicacionComponent,
    AddBlogCategoriasComponent,
    AddBlogPublicacionesComponent,
    ActionsBlogPublicacionesTable
  ],
  entryComponents: [
    AddBlogCategoriasComponent,
    AddBlogPublicacionesComponent,
    ActionsBlogPublicacionesTable
  ],
  providers: [
    BlogService
  ]
})



export  class BlogModule {}
