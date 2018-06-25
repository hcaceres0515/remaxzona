import {Component, OnInit} from "@angular/core";
import {LocalDataSource} from "ng2-smart-table";
import {ActionsPropiedadesTable} from "../mis-propiedades/mis-propiedades.component";
import {PROPERTY_CONTRACT_TYPE, PropertyService} from "../propiedades.service";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
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
      username: {
        title: 'Agente',
        type: 'string',
      },
      property_contract_name: {
        title: 'Situación',
        type: 'string',
      },
      title: {
        title: 'Propiedad',
        type: 'string',
      },
      property_status_name: {
        title: 'Estado',
        type: 'string',
      },
      department_name: {
        title: 'Departamento',
        type: 'string'
      },
      province_name: {
        title: 'Provincia',
        type: 'string'
      },
      district_name: {
        title: 'Distrito',
        type: 'string'
      },
      symbol_price: {
        title: 'Precio',
        type: 'string'
      },
      property_type_name: {
        title: 'Tipo',
        type: 'string'
      },
      symbol_area: {
        title: 'Area',
        type: 'string'
      },
      commission_percentage: {
        title: 'Comision(%)',
        type: 'string'
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsPropiedadesTable,
        onComponentInitFunction: (instance) => {
          instance.reloadPropertiesTable.subscribe(row => {
          });
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

	constructor(private propertyService: PropertyService, private  authService: NbAuthService){}

  ngOnInit() {

	  this.getPropertyNotActive();

  }

  getPropertyNotActive() {

	  this.propertyService.getPropertyNotActive(this.authService.getUserId()).subscribe(
	    response => { this.properties = response.data },
      error => {},
      () => {
	      console.log(this.properties);
        this.source.load(this.properties);
      }
    );

  }
}
