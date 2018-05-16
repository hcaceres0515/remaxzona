import {Component, EventEmitter, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Office} from "./office";
import {OficinaService} from "./oficina.service";


/**
 * Created by harold on 5/3/18.
 */


@Component({
  selector: 'ngx-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form #officeAddForm="ngForm" novalidate>
        <div class="form-group row">
          <label for="inputName" class="col-sm-3 col-form-label">Nombre *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputName" name="name" placeholder="Nombre" [(ngModel)]="office.name" required #name="ngModel" [disabled]="isView">
            
            <div *ngIf="name.errors && (name.dirty || name.touched)">
              <p class="text-danger">Campo Requerido</p>
            </div>
            
          </div>
        </div>
        
        <div class="form-group row">
          <label for="inputAddress" class="col-sm-3 col-form-label">Dirección *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputAddress" name="address" placeholder="Dirección" [(ngModel)]="office.address" required #address="ngModel" [disabled]="isView">

            <div *ngIf="address.errors && (address.dirty || address.touched)">
              <p class="text-danger">Campo Requerido</p>
            </div>
            
          </div>
        </div>

        <div class="form-group row">
          <label for="inputPhone" class="col-sm-3 col-form-label">Teléfono</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputPhone" name="phone" placeholder="Teléfono" [(ngModel)]="office.phone" [disabled]="isView">
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail" class="col-sm-3 col-form-label">E-mail *</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" id="inputEmail" name="email" placeholder="E-mail" [(ngModel)]="office.email" required #email="ngModel" [disabled]="isView">

            <div *ngIf="email.errors && (email.dirty || email.touched)">
              <p class="text-danger">Campo Requerido</p>
            </div>
            
          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmailPassword" class="col-sm-3 col-form-label">E-mail Password *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputEmailPassword" name="email_password" placeholder="E-mail Password" [(ngModel)]="office.email_password" required #email_password="ngModel" [disabled]="isView">

            <div *ngIf="email_password.errors && (email_password.dirty || email_password.touched)">
              <p class="text-danger">Campo Requerido</p>
            </div>
            
          </div>
        </div>

        <div class="form-group row">
          <label for="inputManagerName" class="col-sm-3 col-form-label">Nombre del Administrador</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputManagerName"  name="manager_name" placeholder="Nombre del Administrador" [(ngModel)]="office.manager_name" [disabled]="isView">
          </div>
        </div>

        <div class="form-group row">
          <label for="inputManagerPhone" class="col-sm-3 col-form-label">Teléfono del Administrador</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputManagerPhone" name="manager_phone" placeholder="Teléfono del Administrador" [(ngModel)]="office.manager_phone" [disabled]="isView">
          </div>
        </div>

      </form>
    </div>
    <div class="modal-footer">
      <!--<button class="btn btn-md btn-success"  [disabled]="!officeAddForm.form.valid" (click)="createOffice()">Guardar</button>-->
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn" (click)="createOffice()"> <i class="fa fa-save"></i>  Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" (click)="updateOffice()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `,
})
export class AddOficinaModalComponent {

  modalHeader: string;
  isView: boolean = false;
  isEdit: boolean = false;

  officeId: any;

  @Output() clickSave: EventEmitter<any> = new EventEmitter();
  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  office: Office = new Office();

  constructor(private activeModal: NgbActiveModal, private officeService: OficinaService) {

  }

  createOffice() {

    this.officeService.createOffice(this.office).subscribe(
      data => {},
      error => {},
      () => {
        this.closeModal();
        this.clickSave.emit();
      }
    );

  }

  updateOffice() {

    let data: any = {id: this.officeId, data: this.office};

    this.officeService.updateOffice(data).subscribe(
      data => {},
      error => {},
      () => {
        this.closeModal();
        this.clickUpdate.emit();
      }
    );

  }

  loadNgModel(data) {

    if (this.isEdit) {
      this.officeId = data.id;
    }

    this.office.name = data.name;
    this.office.address = data.address;
    this.office.phone = data.phone;
    this.office.email = data.email;
    this.office.email_password = data.email_password;
    this.office.manager_name = data.manager_name;
    this.office.manager_phone = data.manager_phone;
  }

  closeModal() {
    this.activeModal.close();
  }
}
