import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
/**
 * Created by harold on 5/16/18.
 */


@Component({
  selector: 'add-customer-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">


      <!--<form #customerAddForm="ngForm" novalidate>-->

        <!--<div class="form-group row">-->
          <!--<label for="inputName" class="col-sm-3 col-form-label">Nombre *</label>-->
          <!--<div class="col-sm-9">-->
            <!--<input type="text" class="form-control" id="inputName" name="name" placeholder="Nombre" [(ngModel)]="user.name" required #name="ngModel" [disabled]="isView">-->

            <!--<small class="form-text error" *ngIf="name.errors && (name.dirty || name.touched)">-->
              <!--Campo Requerido-->
            <!--</small>-->

          <!--</div>-->
        <!--</div>-->

        
      <!--</form>-->
    </div>

    <div class="modal-footer">
      <!--<button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!userAddForm.form.valid" (click)="createUser()"><i class="fa fa-save"></i>Guardar</button>-->
      <!--<button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" (click)="updateUser()"> <i class="fa fa-save"></i>  Actualizar</button>-->
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `
})

export class AddClientesModalComponent {

  modalHeader: string;
  isView: boolean = false;
  isEdit: boolean = false;

  constructor(private activeModal: NgbActiveModal){}

  closeModal() {
    this.activeModal.close();
  }
}
