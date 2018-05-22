import {Component, EventEmitter, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Customer} from "../customer";
import {ClientesService} from "../clientes.service";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
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


      <form #customerAddForm="ngForm" novalidate>

        <div class="form-group row">
          <label for="inputIdentityNumber" class="col-sm-3 col-form-label">Doc. Identidad *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputIdentityNumber" name="identity_number" placeholder="Doc. Identidad" [(ngModel)]="customer.identity_number" required #identity_number="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="identity_number.errors && (identity_number.dirty || identity_number.touched)">
              Campo Requerido
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputName" class="col-sm-3 col-form-label">Nombre *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputName" name="name" placeholder="Nombre" [(ngModel)]="customer.name" required #name="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="name.errors && (name.dirty || name.touched)">
              Campo Requerido
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail" class="col-sm-3 col-form-label">Email *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputEmail" name="email" placeholder="Email" [(ngModel)]="customer.email" required #email="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="email.errors && (email.dirty || email.touched)">
              Campo Requerido
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputFirstPhone" class="col-sm-3 col-form-label">Teléfono *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputFirstPhone" name="first_phone" placeholder="Teléfono" [(ngModel)]="customer.first_phone" required #first_phone="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="first_phone.errors && (first_phone.dirty || first_phone.touched)">
              Campo Requerido
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputSecondPhone" class="col-sm-3 col-form-label">Teléfono 2 </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputSecondPhone" name="second_phone" placeholder="Teléfono Opcional" [(ngModel)]="customer.second_phone" #second_phone="ngModel" [disabled]="isView">
          </div>
        </div>

        <div class="form-group row">
          <label for="inputAddress" class="col-sm-3 col-form-label">Dirección </label>
          <div class="col-sm-9">
            
            <input type="text" class="form-control" id="inputAddress" name="address" placeholder="Dirección" [(ngModel)]="customer.address" #address="ngModel" [disabled]="isView">

          </div>
        </div>

        <div class="form-group row">
          <label for="inputCustomerType" class="col-sm-3 col-form-label">Tipo de Cliente *</label>
          <div class="col-sm-9">
            <select id="inputCustomerType" class="form-control" name="customer_type" [(ngModel)]="customer.customer_type" required #customer_type="ngModel" [disabled]="isView">
              <option *ngFor="let item of customerTypes" value="{{item.id}}">{{item.name}}</option>
            </select>

            <small class="form-text error" *ngIf="customer_type.invalid && customer_type.touched">
              Campo Requerido
            </small>
          </div>
        </div>

        <div class="form-group row" *ngIf="isView">
          
          <label class="col-sm-3 col-form-label">Oficina </label>
          <label class="col-sm-9 col-form-label">{{customer.office_name}} </label>          
          
        </div>

        <div class="form-group row" *ngIf="isView">
          
          <label class="col-sm-3 col-form-label">Agente </label>
          <label class="col-sm-9 col-form-label">{{customer.user_name}} </label>
        
        </div>
        
        <div class="form-group row" *ngIf="isView">
          
          <label class="col-sm-3 col-form-label">Creado </label>          
          <label class="col-sm-9 col-form-label">{{customer.created_at}}</label>

        </div>

        <div class="alert alert-danger" role="alert" *ngIf="customerExist">
          {{messageCustomerExist}}
        </div>
        
      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!customerAddForm.form.valid" (click)="createCustomer()"><i class="fa fa-save"></i>Guardar</button>
      <!--<button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  (click)="createCustomer()"><i class="fa fa-save"></i>Guardar</button>-->
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" [disabled]="!customerAddForm.form.valid" (click)="updateCustomer()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `
})

export class AddClientesModalComponent {

  modalHeader: string;
  isView: boolean = false;
  isEdit: boolean = false;

  isChecked: boolean = false;
  customerExist: boolean = false;
  messageCustomerExist: string = '';

  customer: Customer = new Customer();
  customerTypes: any[];
  customerId: any;

  @Output() clickSave: EventEmitter<any> = new EventEmitter();
  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal, private  customerService: ClientesService, private authService: NbAuthService,){

    this.customerTypes = this.customerService.getCustomerTypes();

    if (this.isView || this.isEdit) {
      let index = this.customerTypes.map(function(e) { return e.id; }).indexOf(this.customer.customer_type);
      this.customer.customer_type = this.customerTypes[index].id;
    }

  }

  closeModal() {
    this.activeModal.close();
  }

  checkCustomerExist(identityNumber, email) {

    let data;

    this.customerService.checkCustomerExist(identityNumber, email).subscribe(
      response => {
        data = response.data;
      },
      error => {},
      () => {

        console.log('exist', data);

        this.isChecked = true;
        if (data != null){

          this.customerExist = true;
          this.messageCustomerExist = 'El cliente ya ha sido registrado el '+ data.created_at  +' por el usuario ' + data.user_name;

        } else {
          this.createCustomer();
        }
      }
    );
  }

  createCustomer() {

    this.customer.user_id = this.authService.getUserId();
    this.customer.office_id = this.authService.getOfficeId();

    if (!this.isChecked) {

      this.checkCustomerExist(this.customer.identity_number, this.customer.email);

    } else {
      this.customerService.createCustomer(this.customer).subscribe(
        response => {},
        error => {},
        () => {
          this.closeModal();
          this.clickSave.emit();
        }
      );
    }

    this.isChecked = false;

  }

  updateCustomer() {

    let data: any = {id: this.customerId, data: this.customer};

    this.customerService.updateCustomer(data).subscribe(
      response => {},
      error => {},
      () => {
        this.closeModal();
        this.clickUpdate.emit();
      }
    );

  }

  loadNgModel(data) {

    if (this.isEdit) {
      this.customerId = data.id;
    }

    if (this.isView) {
      this.customer.office_name = data.office_name;
      this.customer.user_name = data.user_name;
    }

    this.customer.identity_number = data.identity_number;
    this.customer.name = data.name;
    this.customer.email = data.email;
    this.customer.first_phone = data.first_phone;
    this.customer.second_phone = data.second_phone;
    this.customer.address = data.address;
    this.customer.created_at = data.created_at;
    this.customer.customer_type = data.customer_type;
  }
}
