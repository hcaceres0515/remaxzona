/**
 * Created by harold on 5/2/18.
 */


import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {SmartTableService} from "../../../@core/data/smart-table.service";
import {OficinaService} from "./oficina.service";
import {AddOficinaModalComponent} from "./add-oficina-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'actions-oficinas',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsOficinaTable implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() reloadOfficeTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal){}

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
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddOficinaModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Ver Oficina';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

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

  constructor(private service: SmartTableService, private oficinaService: OficinaService, private modalService: NgbModal) {
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
        console.log(offices);
      }
    );
  }

  showLargeModal() {
    const activeModal = this.modalService.open(AddOficinaModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Oficina';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
    });
  }




}
