import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {PropertyService} from "../propiedades.service";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ROLES} from "../../../@core/config/rolesdb";
import {ViewPropertyModalComponent} from "../view-property-modal.component";
/**
 * Created by harold on 6/5/18.
 */

@Component({
  selector: 'actions-mis-propiedades',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()" *ngIf="sessionRolId === ROLES.AGENTE"><i class="ion-edit"></i></button>
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
  }

  showEditModal() {
    // const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    //
    // activeModal.componentInstance.modalHeader = 'Editar Usuario';
    // activeModal.componentInstance.isEdit = true;
    // activeModal.componentInstance.loadNgModel(this.rowData);
    //
    // activeModal.componentInstance.clickUpdate.subscribe(() => {
    //   this.updateCustomers();
    //   this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido actualizado exitosamente');
    // });

  }

  showViewModal() {

    const activeModal = this.modalService.open(ViewPropertyModalComponent, { size: 'lg', container: 'nb-layout'});

    activeModal.componentInstance.modalHeader = 'Ver Propiedad';
    // activeModal.componentInstance.loadNgModel(this.rowData);
    activeModal.componentInstance.propertyId = this.rowData.id;

  }


}

@Component({
	selector: 'ngx-mis-propiedades',
  	templateUrl: './mis-propiedades.component.html'
})

export class MisPropiedadesComponent implements OnInit {

	private properties;
	private userId;

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
      department_name: {
        title: 'Departamento',
        type: 'string'
      },
      province_name: {
        title: 'Departamento',
        type: 'string'
      },
      district_name: {
        title: 'Departamento',
        type: 'string'
      },
      property_type_name: {
        title: 'Tipo',
        type: 'string'
      },
      property_status_name: {
        title: 'Estado',
        type: 'string'
      },
      price: {
        title: 'Precio',
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

	constructor(private propertyService: PropertyService, private authService: NbAuthService){}

  ngOnInit() {

	  this.userId = this.authService.getUserId();
	  this.getPropertiesByUser(this.userId);

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

}
