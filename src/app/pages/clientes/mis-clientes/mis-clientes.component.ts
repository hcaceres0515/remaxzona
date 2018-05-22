import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {AddClientesModalComponent} from "./add-clientes-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {ROLES} from "../../../@core/config/rolesdb";
import {ClientesService} from "../clientes.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";
/**
 * Created by harold on 5/16/18.
 */

@Component({
  selector: 'actions-mis-usuarios',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()" *ngIf="sessionRolId === ROLES.AGENTE"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar" (click)="showDeleteModal()" *ngIf="sessionRolId === ROLES.AGENTE"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsClientesTable implements ViewCell, OnInit {
  renderValue: string;

  ROLES = ROLES;
  sessionRolId: any;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() reloadCustomersTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private customerService: ClientesService, private authService: NbAuthService, private notificationService: NotificationMessageService){}

  ngOnInit() {
    this.sessionRolId = this.authService.getRolId();
  }

  showEditModal() {
    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Editar Usuario';
    activeModal.componentInstance.isEdit = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

    activeModal.componentInstance.clickUpdate.subscribe(() => {
      this.updateCustomers();
      this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido actualizado exitosamente');
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Ver Cliente';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'eliminar este cliente';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        let data = {customer_id: this.rowData.id};
        this.customerService.deleteCustomer(data).subscribe(
          data => {},
          error => {},
          () => {

            this.updateCustomers();
            this.notificationService.showToast('success', 'Confirmación', 'El cliente ha sido eliminado exitosamente');
          }
        )

      }
    );

  }

  updateCustomers() {
    this.reloadCustomersTable.emit();
  }
}

@Component({
  selector: 'ngx-mis-clientes',
  templateUrl: './mis-clientes.component.html'
})

export class MisClientesComponent implements OnInit{

  private customers;

  settings = {
    noDataMessage: 'No se encontraron registros.',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      identity_number: {
        title: 'Doc. Id',
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
      first_phone: {
        title: 'Telefono',
        type: 'string',
      },
      customer_type_name: {
        title: 'Tipo',
        type: 'string',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: [
              { value: 'Vendedor', title: 'Vendedor' },
              { value: 'Comprador', title: 'Comprador' }
            ],
          },
        },
      },
      user_name: {
        title: 'Agente',
        type: 'string'
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsClientesTable,
        onComponentInitFunction: (instance) => {
          instance.reloadCustomersTable.subscribe(row => {
            // this.showEditModal();
            this.loadTable();
          });
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  sessionRolId: any;
  sessionUserId: any;

  ROLES = ROLES;

  constructor(private modalService: NgbModal, private authService: NbAuthService, private customerService: ClientesService, private notificationService: NotificationMessageService) {}

  ngOnInit() {
    this.sessionRolId = this.authService.getRolId();
    this.sessionUserId = this.authService.getUserId();
    this.loadTable();
  }

  loadTable() {

    let customers: any;

    if (this.sessionRolId === ROLES.SUPERADMIN) {

      this.customerService.getAllCustomers().subscribe(
        response => {

          customers = response.data;

          customers.forEach((value) => {
            if (value.customer_type === '1') {
              value.customer_type_name = 'Vendedor';
            } else {
              value.customer_type_name = 'Comprador';
            }
          });
          this.source.load(customers);
        }
      );

    } else if (this.sessionRolId === ROLES.ADMIN) {

      this.customerService.getCustomerByOffice(this.authService.getOfficeId()).subscribe(
        response => {

          customers = response.data;
          customers.forEach((value) => {
            if (value.customer_type === '1') {
              value.customer_type_name = 'Vendedor';
            } else {
              value.customer_type_name = 'Comprador';
            }
          });
          this.source.load(customers);
        }
      );

    } else if (this.sessionRolId === ROLES.AGENTE || this.sessionRolId === ROLES.REVISOR) {

      this.customerService.getCustomerByUser(this.sessionUserId).subscribe(
        response => {

          customers = response.data;
          customers.forEach((value) => {
            if (value.customer_type === '1') {
              value.customer_type_name = 'Vendedor';
            } else {
              value.customer_type_name = 'Comprador';
            }
          });
          this.source.load(customers);
        }
      );

    }

  }

  showAddCustomerModal() {

    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Cliente';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
      this.notificationService.showToast('success', 'Confirmación', 'El cliente ha sido creado exitosamente');
    });

  }

}
