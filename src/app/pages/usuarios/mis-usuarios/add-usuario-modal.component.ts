import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../user";
import {OficinaService} from "../../configuracion/oficinas/oficina.service";
import {RolesService} from "../../configuracion/roles/roles.service";
import {UsuariosService} from "../usuarios.service";
import {ROLES} from "../../../@core/config/rolesdb";
import {ToasterService} from "angular2-toaster";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";
import {SampleLayoutService} from "../../../@theme/layouts/sample/sample.layout.service";
/**
 * Created by harold on 5/12/18.
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


      <form #userAddForm="ngForm" novalidate>
        
        <div class="form-group row">
          <label for="inputName" class="col-sm-3 col-form-label">Nombre y Apellidos *</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="inputName" name="name" placeholder="Nombre" [(ngModel)]="user.name" required #name="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="name.errors && (name.dirty || name.touched)">
              Campo Requerido
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputEmail" class="col-sm-3 col-form-label">E-mail *</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" id="inputEmail" name="email" placeholder="E-mail"  pattern=".+@.+\..+"
                   [(ngModel)]="user.email" required #email="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="email.invalid && email.touched && email?.errors?.required">
              Email es requerido!
            </small>
            <small class="form-text error"
                   *ngIf="email.invalid && email.touched && email?.errors?.pattern">
              Email debe ser una dirección válida
            </small>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputPhone" class="col-sm-3 col-form-label">Teléfono *</label>
          <div class="col-sm-9">
            <input type="phone" class="form-control" id="inputPhone" name="phone" placeholder="Teléfono" [(ngModel)]="user.phone" required #phone="ngModel" [disabled]="isView">

            <small class="form-text error" *ngIf="phone.errors && (phone.dirty || phone.touched)">
              Campo Requerido
            </small>

          </div>
        </div>


        <div class="form-group row" *ngIf="sessionRolId === ROLES.SUPERADMIN">
          <label for="officeId" class="col-sm-3 col-form-label">Oficina *</label>
          <div class="col-sm-9">
            
            <select name="officeId" class="form-control" [(ngModel)]="user.office_id" [disabled]="isView">
              <option  *ngFor="let item of offices" value="{{item.id}}">{{item.name}}</option>
            </select>

          </div>
        </div>

        

        <div class="form-group row" *ngIf="isView || isEdit">
          <label class="col-sm-3 col-form-label">Rol(es)</label>
          <div class="col-sm-9">

            <button class="btn btn-hero-secondary btn-demo" *ngFor="let item of user.roles">{{item.name}}</button>

          </div>
        </div>

        <div class="form-group row" *ngIf="!isView">
          <label for="rolId" class="col-sm-3 col-form-label">Rol *</label>
          <div class="col-sm-9">

            <select name="rolId" class="form-control" [(ngModel)]="user.rol_id" [disabled]="isView" #rol="ngModel">
              <option  *ngFor="let item of roles" value="{{item.id}}">{{item.description}}</option>
            </select>

          </div>
        </div>

        <div class="form-group row" *ngIf="isEdit">
          <label class="col-sm-3 col-form-label">Acciones</label>
          <div class="col-sm-9">
            <button class="btn btn-warning btn-icon btn-tn"  title="Ver" (click)="resetPassword()"><i class="ion-loop"></i>  Generar Password</button>          
          </div>
        </div>
        
        
      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!userAddForm.form.valid" (click)="createUser()"><i class="fa fa-save"></i>Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" [disabled]="!userAddForm.form.valid" (click)="updateUser()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `
})


export class AddUsuarioModalComponent implements OnInit{

  modalHeader: string;
  isView: boolean = false;
  isEdit: boolean = false;

  offices: any = [];
  roles: any = []

  user: User = new User();
  userId: any;

  sessionRolId: any;
  ROLES = ROLES;

  @Output() clickSave: EventEmitter<any> = new EventEmitter();
  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal,
              private authService: NbAuthService,
              private userService: UsuariosService,
              private officeService: OficinaService,
              private rolesService: RolesService,
              private modalService: NgbModal,
              private notificationService: NotificationMessageService,
              private sampleLayoutService: SampleLayoutService
              ) {

  }

  ngOnInit(): void {

    this.sessionRolId = this.authService.getRolId();

    if (this.sessionRolId === ROLES.ADMIN) {
      this.user.office_id = this.authService.getOfficeId();
    }

    this.officeService.getAllOffices().subscribe(
      response => {
        this.offices = response.data;

        if (this.isView || this.isEdit) {
          let index = this.offices.map(function(e) { return e.id; }).indexOf(this.user.office_id);
          this.user.office_id = this.offices[index].id;
        } else {
          this.user.office_id = this.offices[0].id;
        }

      }
    );

    this.rolesService.getAllRoles().subscribe(
      response => {

        this.roles = response.data;

        if (this.sessionRolId == ROLES.ADMIN) {
          let index = this.roles.map(function(e) { return e.id; }).indexOf(ROLES.SUPERADMIN);
          this.roles.splice(index, 1);
        }

        // Solo cuando se crea uno nuevo se preselecciona la primera opcio
        if (!this.isView && !this.isEdit) {
          this.user.rol_id = this.roles[0].id;
        }

        if (this.isView || this.isEdit) {
          this.userService.getUserRol(this.userId).subscribe(
            response => {

              this.user.roles = response.data;
            }
          );
        }

      }
    )

  }

  generateUserRol(rolId) {
    let roles: any = [];
    if (rolId === ROLES.SUPERADMIN){
      roles = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.REVISOR, ROLES.AGENTE];
    } else if (rolId === ROLES.ADMIN) {
      roles = [ROLES.ADMIN, ROLES.REVISOR, ROLES.AGENTE];
    } else if (rolId === ROLES.REVISOR) {
      roles = [ROLES.REVISOR, ROLES.AGENTE];
    } else {
      roles = new Array(ROLES.AGENTE);
    }
    return roles;
  }

  createUser() {

    this.user.roles = this.generateUserRol(this.user.rol_id);
    this.user.facebook = '';

    this.sampleLayoutService.onSetLoadingIcon.emit(true);

    this.userService.createUser(this.user).subscribe(
      data => {},
      error => {},
      () => {
        this.closeModal();
        this.sampleLayoutService.onSetLoadingIcon.emit(false);
        this.clickSave.emit();
      }
    )
  }

  updateUser() {

    if (this.user.rol_id == undefined) {
      this.user.rol_id = -1;
    } else {
      this.user.roles = this.generateUserRol(this.user.rol_id);
    }

    this.user.facebook = '';

    let data: any = {id: this.userId, data: this.user};

    this.userService.updateUser(data).subscribe(
      data => {},
      error => {},
      () => {
        this.closeModal();
        this.clickUpdate.emit();
      }
    );

  }

  resetPassword() {
    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'generar una nueva contraseña';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        this.sampleLayoutService.onSetLoadingIcon.emit(true);

        this.userService.resetPassword(this.userId).subscribe(
          () => {

            this.sampleLayoutService.onSetLoadingIcon.emit(false);
            this.notificationService.showToast('success', 'Confirmación', 'La contraseña ha sido generada exitosamente');
            this.closeModal();
          }
        );

      }
    )
  }

  loadNgModel(data) {

    if (this.isEdit || this.isView) {
      this.userId = data.id;
    }

    this.user.name = data.name;
    this.user.phone = data.phone;
    this.user.email = data.email;
    this.user.office_id = data.office_id;

  }

  closeModal() {
    this.activeModal.close();
  }
}
