import {Component, OnInit} from "@angular/core";
/**
 * Created by harold on 6/5/18.
 */

@Component({
	selector: 'ngx-propiedades-desactivadas',
  	templateUrl: './propiedades-desactivadas.component.html'
})

export class PropiedadesDesactivadasComponent implements OnInit {

	private properties;

	settings = {
    noDataMessage: 'No se encontraron registros.',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'Codigo',
        type: 'string',
      },
      name: {
        title: 'Nombre',
        type: 'string',
      },
      office_name: {
        title: 'Oficina',
        type: 'string',
      },
      user_name: {
        title: 'Agente',
        type: 'string'
      }
    },
  };

	constructor(){}

  ngOnInit() {

  }

}
