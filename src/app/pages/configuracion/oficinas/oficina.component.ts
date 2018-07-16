/**
 * Created by harold on 5/2/18.
 */


import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {SmartTableService} from "../../../@core/data/smart-table.service";
import {OficinaService} from "./oficina.service";
import {AddOficinaModalComponent} from "./add-oficina-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";


@Component({
  selector: 'actions-oficinas',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar" (click)="showDeleteModal()"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsOficinaTable implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() reloadOfficeTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private notificationService: NotificationMessageService, private  officeService: OficinaService){}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  showEditModal() {
    const activeModal = this.modalService.open(AddOficinaModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Editar Oficina';
    activeModal.componentInstance.isEdit = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

    activeModal.componentInstance.clickUpdate.subscribe(() => {
      this.updateOffice();
      this.notificationService.showToast('success', 'Confirmación', 'La oficina ha sido actualizada exitosamente');
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddOficinaModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Ver Oficina';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'eliminar esta oficina';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {
        let data = {office_id: this.rowData.id};
        this.officeService.deleteOffice(data).subscribe(
          response => {},
          error => {},
          () => {
            this.updateOffice();
            this.notificationService.showToast('success', 'Confirmación', 'La oficina ha sido eliminada exitosamente');
          }
        )
      }
    );



  }

  updateOffice() {
    this.reloadOfficeTable.emit();
  }
}


@Component({
  selector: 'ngx-oficina',
  templateUrl: './oficina.component.html'
})

export class OficinaComponent{


  settings = {
    noDataMessage: 'No se encontraron registros.',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Nombre',
        type: 'string',
      },
      address: {
        title: 'Dirección',
        type: 'string',
      },
      phone: {
        title: 'Telefono',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      manager_name: {
        title: 'Administrador',
        type: 'string',
      },
      created_at: {
        title: 'Creado',
        type: 'string',
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsOficinaTable,
        onComponentInitFunction:(instance)=> {
          instance.reloadOfficeTable.subscribe(row => {
            // this.showEditModal();
            this.loadTable();
          });
        }
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableService, private oficinaService: OficinaService, private modalService: NgbModal, private notificationService: NotificationMessageService) {
    // const data = this.service.getData();

    this.loadTable();

  }

  loadTable() {
    let offices: any;

    this.oficinaService.getAllOffices().subscribe(
      data => offices = (data),
      error => {},
      () => {
        offices = offices.data;
        this.source.load(offices);
      }
    );
  }

  showAddOfficeModal() {
    const activeModal = this.modalService.open(AddOficinaModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Oficina';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
      this.notificationService.showToast('success', 'Confirmación', 'La oficina ha sido creado exitosamente');
    });
  }

}
