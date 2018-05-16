import {Component, EventEmitter, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
/**
 * Created by harold on 5/14/18.
 */



@Component({
  selector: 'add-user-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <span> ¿Esta seguro de eliminar {{modalBodyMessage}}? </span>
    </div>

    <div class="modal-footer">
      <!--<button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!userAddForm.form.valid" (click)="createUser()"><i class="fa fa-save"></i>Guardar</button>-->
      <button class="btn btn-success btn-with-icon btn-tn" (click)="confirmAction()"><i class="ion-checkmark-round"></i> SI</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="ion-close-round"></i> NO</button>
    </div>
  `
})

export class ConfirmationModalComponent {

  modalHeader: string;
  modalBodyMessage: string;

  @Output() clickConfirm: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal) {

  }

  confirmAction() {
    this.clickConfirm.emit();
    this.activeModal.close();
  }

  closeModal() {
    this.activeModal.close();
  }
}
