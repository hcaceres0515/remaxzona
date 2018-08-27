import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { TeamComponent } from './team/team.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from './weather/weather.component';
import { SolarComponent } from './solar/solar.component';
import { PlayerComponent } from './rooms/player/player.component';
import { TrafficComponent } from './traffic/traffic.component';
import { TrafficChartComponent } from './traffic/traffic-chart.component';
import { DashboardService } from "./dashboard.service";
import { ViewPropertyModalComponent } from "../propiedades/view-property-modal.component";
import { NgxGalleryModule } from "ngx-gallery";
import { AgmCoreModule } from "@agm/core";
import { PropertyService } from "../propiedades/propiedades.service";


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
    NgxGalleryModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDkjHH-qFd7miP6TMmw3fqsvzt7S0MkFio',
      libraries: ["places"]
    }),
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    // ViewPropertyModalComponent
  ],
  providers: [
    DashboardService,
    PropertyService
  ],
  entryComponents: [
    // ViewPropertyModalComponent
  ]
})
export class DashboardModule { }
