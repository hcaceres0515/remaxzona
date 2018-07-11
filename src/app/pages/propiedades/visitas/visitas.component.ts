import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddVisitasModalComponent} from "./add-visitas-modal.component";
import {ROLES} from "../../../@core/config/rolesdb";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {PropertyService} from "../propiedades.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";


@Component({
  selector: 'actions-mis-visitas',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar" (click)="showDeleteModal()"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsVisitasTable implements ViewCell, OnInit {
  renderValue: string;

  ROLES = ROLES;
  sessionRolId: any;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() reloadPropertyVisitTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private authService: NbAuthService,
              private notificationService: NotificationMessageService, private propertyService: PropertyService){}

  ngOnInit() {
    this.sessionRolId = this.authService.getRolId();
  }

  showEditModal() {

    const activeModal = this.modalService.open(AddVisitasModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static'});

    activeModal.componentInstance.modalHeader = 'Editar Visita';
    activeModal.componentInstance.isEdit = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

    activeModal.componentInstance.clickUpdate.subscribe(() => {
      this.updateVisits();
      this.notificationService.showToast('success', 'Confirmación', 'La visita ha sido actualizada exitosamente');
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddVisitasModalComponent, { size: 'lg', container: 'nb-layout'});

    activeModal.componentInstance.modalHeader = 'Ver Visita';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'eliminar esta visita';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        let data = {id: this.rowData.id, status: -1};
        this.propertyService.propertyVisitUpdate(data).subscribe(
          data => {},
          error => {},
          () => {
            this.updateVisits();
            this.notificationService.showToast('success', 'Confirmación', 'La visita ha sido eliminada exitosamente');
          }
        )

      }
    );

  }

  updateVisits() {
    this.reloadPropertyVisitTable.emit();
  }

}

@Component({
	selector: 'visitas',
	templateUrl: './visitas.component.html',
  // styles: [
  //   `.overlayDiv {
  //     position: fixed;
  //     width: 100%;
  //     height: 100%;
  //     left: 0;
  //     top: 0;
  //     background: #e3e9ee9c;
  //     z-index: 10;
  //   }
  //   .overlayDiv > i {
  //     position: absolute;
  //     left: 48%;
  //     top: 50%;
  //     color: #40dc7e;
  //   }`
  // ]
})

export class VisitasComponent implements  OnInit{

  sessionRolId: any;
  userId: any;
  ROLES = ROLES;

  propertiesVisits: any = [];

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
      customer_name: {
        title: 'Cliente',
        type: 'string',
      },
      property_id: {
        title: 'Cod. Propiedad',
        type: 'string',
      },
      title: {
        title: 'Título',
        type: 'string',
      },
      comments: {
        title: 'Comentarios',
        type: 'string',
      },
      created_at: {
        title: 'Fecha',
        type: 'string'
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsVisitasTable,
        onComponentInitFunction: (instance) => {
          instance.reloadPropertyVisitTable.subscribe(row => {
            // this.showEditModal();
            this.loadTable();
          });
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

	constructor(private modalService: NgbModal, private authService: NbAuthService, private propertyService: PropertyService,
              private notificationService: NotificationMessageService) {}

  ngOnInit() {

    this.sessionRolId = this.authService.getRolId();
    this.userId = this.authService.getUserId();
    this.loadTable();

  }

  loadTable() {
	  this.propertyService.getPropertiesVisitsByUser(this.userId).subscribe(
	    response => {
	      this.propertiesVisits = response.data;
	      console.log(this.propertiesVisits);
	      this.source.load(this.propertiesVisits);
      },
      error => {},
      () => {}
    );
  }

	showAddVisitModal() {

    const activeModal = this.modalService.open(AddVisitasModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static'});

    activeModal.componentInstance.modalHeader = 'Agregar Visita';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
      this.notificationService.showToast('success', 'Confirmación', 'La visita ha sido creada exitosamente');
    });

  }

}
