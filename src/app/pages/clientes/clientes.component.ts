import {Component} from "@angular/core";
/**
 * Created by harold on 5/15/18.
 */

@Component({
  selector: 'ngx-clientes',
  template: `
    <router-outlet></router-outlet>
  `,
})

export class ClientesComponent {

  constructor() {
    console.log('Load Clientes Component');
  }
}
