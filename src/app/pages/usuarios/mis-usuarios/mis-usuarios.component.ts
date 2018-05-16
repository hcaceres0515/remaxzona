import {Component, EventEmitter, OnInit, Output, Input} from "@angular/core";
import {UsuariosService} from "../usuarios.service";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUsuarioModalComponent} from "./add-usuario-modal.component";

/**
 * Created by harold on 5/12/18.
 */

import 'style-loader!angular2-toaster/toaster.css';
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {ROLES} from "../../../@core/config/rolesdb";

@Component({
  selector: 'actions-mis-usuarios',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar" (click)="showDeleteModal()"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsMisUsuariosTable implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() reloadUserTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private userService: UsuariosService, private notificationService: NotificationMessageService){}

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  showEditModal() {
    const activeModal = this.modalService.open(AddUsuarioModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Editar Usuario';
    activeModal.componentInstance.isEdit = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

    activeModal.componentInstance.clickUpdate.subscribe(() => {
      this.updateUser();
      this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido actualizado exitosamente');
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddUsuarioModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Ver Usuario';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'este usuario';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        let data = {user_id: this.rowData.id};
        this.userService.deleteUser(data).subscribe(
          data => {},
          error => {},
          () => {

            this.updateUser();
            this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido eliminado exitosamente');
          }
        )

      }
    );

  }

  updateUser() {
    this.reloadUserTable.emit();
  }
}

@Component({
  selector: 'ngx-mis-usuarios',
  templateUrl: './mis-usuarios.component.html'
})

export class MisUsuariosComponent implements OnInit{

  private users;

  settings = {
    noDataMessage: 'No se encontraron registros.',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      name: {
        title: 'Nombre',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      office_name: {
        title: 'Oficina',
        type: 'string',
      },
      last_login: {
        title: 'Ultimo Ingreso',
        type: 'string',
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsMisUsuariosTable,
        onComponentInitFunction: (instance) => {
          instance.reloadUserTable.subscribe(row => {
            // this.showEditModal();
            this.loadTable();
          });
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  sessionRolId: any;

  constructor(private userService: UsuariosService, private modalService: NgbModal, private notificationService: NotificationMessageService, private authService: NbAuthService){}

  ngOnInit() {

    this.sessionRolId = this.authService.getRolId();
    this.loadTable();

  }

  loadTable() {

    let users: any;

    if (this.sessionRolId === ROLES.SUPERADMIN) {

      this.userService.getAllUsers().subscribe(
        data => {
          console.log(data);
          users = data;
          users = users.data;
          this.source.load(users);
        }
      );

    } else if (this.sessionRolId === ROLES.ADMIN) {

      console.log('user by office');

      this.userService.getUsersByOffice(this.authService.getOfficeId()).subscribe(
        data => {
          users = data;
          users = users.data;
          this.source.load(users);
        }
      );

    }
    // Get only user of office admin

  }

  showAddUserModal() {

    const activeModal = this.modalService.open(AddUsuarioModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Usuario';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
      this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido creado exitosamente');
    });

  }



}
