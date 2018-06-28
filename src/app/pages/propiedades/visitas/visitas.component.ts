import {Component, OnInit} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddVisitasModalComponent} from "./add-visitas-modal.component";
import {ROLES} from "../../../@core/config/rolesdb";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";

@Component({
	selector: 'visitas',
	templateUrl: './visitas.component.html'
})

export class VisitasComponent implements  OnInit{

  sessionRolId: any;
  ROLES = ROLES;

	constructor(private modalService: NgbModal, private authService: NbAuthService,) {}


  ngOnInit() {
    this.sessionRolId = this.authService.getRolId();

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
