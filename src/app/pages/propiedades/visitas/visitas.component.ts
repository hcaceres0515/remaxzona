import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddVisitasModalComponent} from "./add-visitas-modal.component";
import {ROLES} from "../../../@core/config/rolesdb";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {PropertyService} from "../propiedades.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";


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

  }

  showViewModal() {

    // this.propertyService.getPropertyVisitDetail(this.rowData.id).subscribe(
    //   response => {
    //     console.log(response.data);
    //   },
    //   error => {},
    //   () => {
    //
    //   }
    // );

    const activeModal = this.modalService.open(AddVisitasModalComponent, { size: 'lg', container: 'nb-layout'});

    activeModal.componentInstance.modalHeader = 'Ver Visita';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

  }

}

@Component({
	selector: 'visitas',
	templateUrl: './visitas.component.html'
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

	constructor(private modalService: NgbModal, private authService: NbAuthService, private propertyService: PropertyService) {}

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

    // activeModal.componentInstance.clickSave.subscribe(() => {
    //   this.loadTable();
    //   this.notificationService.showToast('success', 'Confirmación', 'El cliente ha sido creado exitosamente');
    // });

  }

}
