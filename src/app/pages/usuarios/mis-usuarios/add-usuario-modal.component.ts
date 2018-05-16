import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../user";
import {OficinaService} from "../../configuracion/oficinas/oficina.service";
import {RolesService} from "../../configuracion/roles/roles.service";
import {UsuariosService} from "../usuarios.service";
import {ROLES} from "../../../@core/config/rolesdb";
import {ToasterService} from "angular2-toaster";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
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
          <label for="inputName" class="col-sm-3 col-form-label">Nombre *</label>
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

            <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
              Email es requerido!
            </small>
            <small class="form-text error"
                   *ngIf="email.invalid && email.touched && email.errors?.pattern">
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


        <div class="form-group row" *ngIf="this.sessionRolId === ROLES.SUPERADMIN">
          <label for="officeId" class="col-sm-3 col-form-label">Oficina *</label>
          <div class="col-sm-9">
            
            <select name="officeId" class="form-control" [(ngModel)]="user.office_id" [disabled]="isView">
              <option  *ngFor="let item of offices" value="{{item.id}}">{{item.name}}</option>
            </select>

          </div>
        </div>

        <div class="form-group row">
          <label for="rolId" class="col-sm-3 col-form-label">Rol *</label>
          <div class="col-sm-9">

            <select name="rolId" class="form-control" [(ngModel)]="user.rol_id" [disabled]="isView">
              <option  *ngFor="let item of roles" value="{{item.id}}">{{item.description}}</option>
            </select>

          </div>
        </div>
        
        
      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!userAddForm.form.valid" (click)="createUser()"><i class="fa fa-save"></i>Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" (click)="updateUser()"> <i class="fa fa-save"></i>  Actualizar</button>
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
              private toasterService: ToasterService) {

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
        this.user.rol_id = this.roles[0].id;

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

    console.log('user', this.user);

    this.userService.createUser(this.user).subscribe(
      data => {},
      error => {},
      () => {
        this.closeModal();
        this.clickSave.emit();
      }
    )
  }

  updateUser() {

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

  loadNgModel(data) {

    if (this.isEdit) {
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
