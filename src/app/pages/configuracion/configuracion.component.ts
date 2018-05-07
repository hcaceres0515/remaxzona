/**
 * Created by harold on 5/2/18.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'ngx-configuracion',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class ConfiguracionComponent {

  constructor() {
    console.log('Configuracion Component is loaded');
  }
}
