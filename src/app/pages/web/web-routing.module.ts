import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WebComponent} from "./web.component";
import {AuthGuardService} from "../../@core/utils/auth-guard.service";
import {SliderComponent} from "./slider/slider.component";
/**
 * Created by harold on 7/11/18.
 */


const routes: Routes = [{
  path: '',
  component: WebComponent,
  canActivate: [AuthGuardService],
  children: [{
    path: 'web-slider',
    component: SliderComponent,
  }
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class WebRoutingModule {}
