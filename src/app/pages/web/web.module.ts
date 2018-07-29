import {NgModule} from "@angular/core";
import {ThemeModule} from "../../@theme/theme.module";
import {ToasterModule} from "angular2-toaster";
import {SliderComponent} from "./slider/slider.component";
import {WebComponent} from "./web.component";
import {WebRoutingModule} from "./web-routing.module";
import {SliderService} from "./slider/slider.service";
/**
 * Created by harold on 7/11/18.
 */


@NgModule({
  imports: [
    ThemeModule,
    WebRoutingModule,
    ToasterModule,
  ],
  declarations: [
    WebComponent,
    SliderComponent
  ],
  entryComponents: [
  ],
  providers: [
    SliderService
  ]
})

export  class WebModule {}
