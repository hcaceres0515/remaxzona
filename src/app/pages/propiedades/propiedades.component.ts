import {Component} from "@angular/core";
/**
 * Created by harold on 6/3/18.
 */

@Component({
  selector: 'ngx-propiedades',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class PropiedadesComponent {

  constructor() {
    console.log('Propiedades Components');
  }
}
