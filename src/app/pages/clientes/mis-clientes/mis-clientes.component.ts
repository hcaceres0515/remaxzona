import {Component} from "@angular/core";
import {LocalDataSource} from "ng2-smart-table";
import {AddClientesModalComponent} from "./add-clientes-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
/**
 * Created by harold on 5/16/18.
 */

@Component({
  selector: 'ngx-mis-clientes',
  templateUrl: './mis-clientes.component.html'
})

export class MisClientesComponent {


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
      email: {
        title: 'Email',
        type: 'string',
      },
      first_phone: {
        title: 'Telefono',
        type: 'string',
      },
      customer_type: {
        title: 'Tipo',
        type: 'string',
      },
      created_at: {
        title: 'Creado',
        type: 'string'
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private modalService: NgbModal) {}

  showAddCustomerModal() {

    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Cliente';

    // activeModal.componentInstance.clickSave.subscribe(() => {
    //   this.loadTable();
    //   this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido creado exitosamente');
    // });

  }

}
