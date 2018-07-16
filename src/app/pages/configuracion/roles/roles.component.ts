/**
 * Created by harold on 5/2/18.
 */


import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {SmartTableService} from "../../../@core/data/smart-table.service";
import {RolesService} from "./roles.service";
import {AssignMenuModalComponent} from "./assign-menu-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'actions-roles',
  template: `
    <div style="display: flex">
      <button class="btn btn-warning btn-icon btn-tn" (click)="onClick()" title="Asignar"><i class="ion-checkmark-circled"></i></button>
    </div>    
  `,
})
export class ActionsRolesTable implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal){}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
    // this.rowData = this.value;
    // console.log(this.rowData);
  }

  onClick() {
    const activeModal = this.modalService.open(AssignMenuModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Asignar Funcionalidad - Rol ' + this.rowData.description;
    activeModal.componentInstance.rolId = this.rowData.id;
    // console.log('click me');
    // this.save.emit(this.rowData);
  }
}

@Component({
  selector: 'ngx-roles',
  templateUrl: './roles.component.html'
})

export class RolesComponent {
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
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsRolesTable,
        // valuePrepareFunction: (cell, row) => row,
        onComponentInitFunction:(instance)=> {
          instance.save.subscribe(row => {
            this.showEditModal();
          });
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableService, private rolesService: RolesService) {
    const data = this.service.getData();
    // this.source.load(data);

    let roles: any;

    this.rolesService.getAllRoles().subscribe(
      data => roles = (data),
      error => {},
      () => {
        roles = roles.data;
        this.source.load(roles);

      }
    );

  }

  showEditModal() {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
