import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PropertyService} from "../propiedades.service";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ROLES} from "../../../@core/config/rolesdb";
import {ViewPropertyModalComponent} from "../view-property-modal.component";
import {OficinaService} from "../../configuracion/oficinas/oficina.service";
import {UsuariosService} from "../../usuarios/usuarios.service";
/**
 * Created by harold on 6/5/18.
 */

@Component({
  selector: 'actions-mis-propiedades',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" *ngIf="editPermission()"
              [routerLink]="['/pages/propiedades/editar-propiedad', rowData.id]">
      <i class="ion-edit"></i></button>
    </div>
  `,
})

export class ActionsPropiedadesTable implements ViewCell, OnInit {
  renderValue: string;

  ROLES = ROLES;
  sessionRolId: any;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() reloadPropertiesTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private authService: NbAuthService, private notificationService: NotificationMessageService){}

  ngOnInit() {

    this.sessionRolId = this.authService.getRolId();
    console.log(this.rowData);

  }

  showViewModal() {

    const activeModal = this.modalService.open(ViewPropertyModalComponent, { size: 'lg', container: 'nb-layout'});

    activeModal.componentInstance.modalHeader = 'Ver Propiedad';
    // activeModal.componentInstance.loadNgModel(this.rowData);
    activeModal.componentInstance.propertyId = this.rowData.id;

  }

  editPermission() {

    if (this.rowData.user_id == this.authService.getUserId()) {

      return true;

    } else if ((this.authService.getRolId() == ROLES.REVISOR || this.authService.getRolId() == ROLES.ADMIN) && this.rowData.office_id && this.authService.getOfficeId()) {

      return true;

    }
  }


}

@Component({
	selector: 'ngx-mis-propiedades',
  	templateUrl: './mis-propiedades.component.html'
})

export class MisPropiedadesComponent implements OnInit {

	private properties;
	private userId;
	private officeId;

	propertyId: any;

	offices: any[];
	users: any[];
  departments: any[];
  provinces: any[];
  districts: any[];
  propertyStatus: any[];
  propertyType: any[];
  propertyCoin: any[];

  selectedDepartment: any;
  selectedProvince: any;
  selectedDistrict: any;

  selectedPropertyStatus: any = {id: ''};
  selectedPropertyType: any = {id: ''};
  selectedPropertyCoin: any;

  minimumPrice: number;
  maximumPrice: number;

  selectedOffice: any;
  selectedUser: any;

  invalidProperty: boolean = false;
  invalidPropertyMessage: string = '';

  propertiesByLocationFilter: any[] = []; //Save data from location filter
  propertiesByFeaturesFilter: any[] = []; //Save data from location filter

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
      office_name: {
        title: 'Oficina',
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
            // this.showEditModal();
            this.getPropertiesByUser(2);
          });
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

	constructor(private propertyService: PropertyService, private authService: NbAuthService,
              private officeService: OficinaService, private userService: UsuariosService){}

  ngOnInit() {

	  this.userId = this.authService.getUserId();
	  this.officeId = this.authService.getOfficeId();
	  this.getPropertiesByUser(this.userId);
	  this.getDepartments();
    this.getAllOffices();
    this.getPropertyStatus();
    this.getPropertyType();
    this.getCoinType();

  }

  onChangeUser(user) {
    this.getPropertiesByUser(user.id);
  }

  onChangeOffice(office) {
    this.userService.getUsersByOffice(office.id).subscribe(
      response => {
        this.users = response.data;
      },
      error => {},
      () => {

      }
    );

    this.propertyService.getPropertiesByOffice(this.officeId).subscribe(
      response => {
        this.properties = response.data;
      },
      error => {},
      () => {
        console.log(this.properties);
        this.source.load(this.properties);
      }
    );
  }

  searchProperty() {

	  let properties: any = [];

    if (this.propertyId != null) {

      this.propertyService.getPropertyInfoById(this.propertyId).subscribe(
        response => {
          this.properties = response.data;
        },
        error => {
          this.invalidProperty = true;
          this.invalidPropertyMessage = 'El código de la propiedad no existe';
          setTimeout(function() {
            this.invalidProperty = false;
          }.bind(this), 3000);
        },
        () => {
          console.log(this.properties);
          this.sourceLoadTable(this.properties);
          properties.push(this.properties);
          this.source.load(properties);
        }
      );
    }
  }

  sourceLoadTable(data) {

    this.propertiesByLocationFilter = data;
    this.propertiesByFeaturesFilter = data;

  }

  locationFilter() {

    let propertiesFilter;

    if ((this.selectedDepartment.id !== 0) && (this.selectedProvince.id !== 0) && (this.selectedDistrict.id !== 0)) {

      propertiesFilter = this.properties.filter(
        property => (property.department_id === this.selectedDepartment.id
        && property.province_id === this.selectedProvince.id
        && property.district_id === this.selectedDistrict.id));

    } else if ((this.selectedDepartment.id !== 0) && (this.selectedProvince.id !== 0)) {

      propertiesFilter = this.properties.filter(
        property => (property.department_id === this.selectedDepartment.id
        && property.province_id === this.selectedProvince.id));

    } else if ((this.selectedDepartment.id !== 0)) {

      propertiesFilter = this.properties.filter(
        property => (property.department_id === this.selectedDepartment.id));

    } else {
      propertiesFilter = this.properties;
    }

    this.source.load(propertiesFilter);

    this.propertiesByLocationFilter = propertiesFilter;

  }

  priceFilter() {

    let propertiesData = this.propertiesByFeaturesFilter;
    let propertiesFilter;

    let coinId = this.selectedPropertyCoin.id;

    if (this.minimumPrice != null && this.maximumPrice != null) {

      propertiesFilter = propertiesData.filter(
        property => (parseFloat(property.price) >= this.minimumPrice && parseFloat(property.price) <= this.maximumPrice) && property.property_coin_id === coinId);

    } else if (this.minimumPrice != null && this.maximumPrice == null) {

      propertiesFilter = propertiesData.filter(
        property => (parseFloat(property.price) >= this.minimumPrice) && property.property_coin_id === coinId);

    } else if (this.minimumPrice == null && this.maximumPrice != null) {

      propertiesFilter = propertiesData.filter(
        property => (parseFloat(property.price) <= this.maximumPrice) && property.property_coin_id === coinId);

    } else {
      propertiesFilter = propertiesData;
    }

    this.source.load(propertiesFilter);
  }

  onChangeFilterProperty() {

    let propertiesData = this.propertiesByLocationFilter;
    let properties;

    if (this.selectedPropertyType.id !== '' && this.selectedPropertyStatus.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_type_id === this.selectedPropertyType.id
        && property.property_status_id === this.selectedPropertyStatus.id)
      );

    } else if (this.selectedPropertyType.id !== '' && this.selectedPropertyStatus.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_type_id === this.selectedPropertyType.id
        && property.property_status_id === this.selectedPropertyStatus.id)
      );

    } else if (this.selectedPropertyStatus.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_type_id === this.selectedPropertyStatus.id)
      );

    } else if (this.selectedPropertyType.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_type_id === this.selectedPropertyType.id)
      );

    } else if (this.selectedPropertyType.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_type_id === this.selectedPropertyType.id)
      );

    } else if (this.selectedPropertyStatus.id !== '') {

      properties = propertiesData.filter(
        property => (property.property_status_id === this.selectedPropertyStatus.id)
      );

    }

    this.propertiesByFeaturesFilter = properties;
    this.source.load(properties);
  }

  getAllOffices() {
	  this.officeService.getAllOffices().subscribe(
	    response => {
	      this.offices = response.data;
      },
      error => {},
      () => {

      }
    );
  }

  getPropertiesByUser(userId) {
	  this.propertyService.getPropertiesByUser(userId).subscribe(
	    response => {this.properties = response.data},
      error => {},
      () => {
        this.source.load(this.properties);
      }
    );
  }


  getDepartments() {

    this.propertyService.getDepartments().subscribe(
      response => {this.departments = response.data},
      error => {},
      () => {
        this.departments.unshift({id: 0, name: 'TODOS'});
        this.selectedDepartment = this.departments[0];

        this.provinces = [];
        this.provinces.push({id: 0, name: 'TODOS'});
        this.selectedProvince = this.provinces[0];

        this.districts = [];
        this.districts.push({id: 0, name: 'TODOS'});
        this.selectedDistrict = this.districts[0];
      }
    );
  }

  onChangeDepartment(department) {
    console.log(department);
    this.propertyService.getProvinceByDepartment(department.id).subscribe(
      response => {this.provinces = response.data},
      error => {},
      () => {
        this.provinces.unshift({id: 0, name: 'TODOS'});
        this.selectedProvince = this.provinces[0];
      }
    );
  }

  onChangeProvince(province) {
    this.propertyService.getDistrictByProvince(province.id).subscribe(
      response => {this.districts = response.data},
      error => {},
      () => {
        this.districts.unshift({id: 0, name: 'TODOS'});
        this.selectedDistrict = this.districts[0];
      }
    );
  }

  getPropertyStatus() {
    this.propertyService.getPropertyStatus().subscribe(
      response => {this.propertyStatus = response.data},
      error => alert(error),
      () => {
      }
    );
  }

  getPropertyType() {
    this.propertyService.getPropertyType().subscribe(
      response => {this.propertyType = response.data},
      error => alert(error),
      () => {
      }
    );
  }

  getCoinType() {
    this.propertyService.getPropertyCoin().subscribe(
      (response) => {this.propertyCoin = response.data},
      (error) => {},
      () => {
        this.selectedPropertyCoin = this.propertyCoin[0];
      }
    );
  }


  onlyNumberKey(event) {

    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;

  }

  resetFilters() {
    this.getPropertiesByUser(this.userId);
    this.selectedOffice = null;
    this.selectedUser = null;
    this.getDepartments();
    // this.getCoinType();
    // this.filterOption = '1'; // Select first option
    this.selectedPropertyType = {id: ''}; //Ya no se consume el servicio, solo se deselecciona la opcion
    this.selectedPropertyStatus = {id: ''};
    // this.selectedPropertyContract = {id: ''};
    this.selectedUser = null;
    // this.loadingIcon = false;
    this.maximumPrice = null;
    this.minimumPrice = null;
    this.propertyId = '';
  }

}
