/**
 * Created by harold on 5/5/18.
 */

import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {RolesService} from "./roles.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";

@Component({
  selector: 'asign-menu-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form>
        
        <div class="row">
          <div class="col-sm-4" *ngFor="let item of menu">
            
            <fieldset>
              <legend>{{item.title}}</legend>
              <nb-checkbox style="display: block" [value]="value.checked" *ngFor="let value of item.children" (change)="getSelected(value, $event)">{{value.title}}</nb-checkbox>
              <!--<label class="custom-control custom-checkbox" *ngFor="let value of item.children">-->
                <!--<input type="checkbox" class="custom-control-input" name="menu" value="{{value.id}}" [checked]="true" [(ngModel)]="value.checked">-->
                <!--<span class="custom-control-indicator"></span>-->
                <!--<span class="custom-control-description">{{value.title}}</span>-->
              <!--</label>-->
              <br>
            </fieldset>
                       
          </div>          
          
        </div>        

      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-success btn-with-icon btn-tn" (click)="updateRolMenu()"> <i class="fa fa-save"></i> Guardar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `,
})

export class AssignMenuModalComponent {

  modalHeader: string;
  menu: any = [];
  rolId: number;

  rolMenu: any = [];

  constructor(private activeModal: NgbActiveModal, private rolesService: RolesService, private notificationService: NotificationMessageService) {

    let response: any = [];

    this.rolesService.getAllMenu().subscribe(
      data => {
        response = (data);
      },
      error => {},
      () => {
        response = response.data;

        let newMenu :any = [];
        let i = 0;

        // console.log(newMenu);

        let rolMenu: any = [];

        this.rolesService.getRolMenu(this.rolId).subscribe(
          data => rolMenu = (data),
          error => {},
          () => {

            rolMenu = rolMenu.data;

            Object.keys(response).forEach((index) => {

              (response[index].children).forEach((value) => {
                let myMenu = rolMenu.find(x => x.menu_id === value.id);

                if (myMenu !== undefined) {
                  this.rolMenu.push(value);
                  value.checked = true;
                } else {
                  value.checked = false;
                }

              });

              newMenu[i++] = response[index];

            })

            this.menu = newMenu;

            // console.log(this.menu);
          }
        );

      }
    );

  }

  getSelected(value, event) {
    if (event.target.checked) {
      this.rolMenu.push(value);
    } else {
      let i = this.rolMenu.indexOf(value);
      this.rolMenu.splice(i, 1);
    }

    // console.log(this.rolMenu);

  }

  updateRolMenu() {

    let newRolMenu: any = [];

    (this.rolMenu).forEach((item) => {

      // let parent = {rol_id: this.rolId, menu_id: item.parent, status: 1};

      let value = newRolMenu.find(x => x.menu_id === item.parent);

      if (value === undefined) {
        newRolMenu.push({rol_id: this.rolId, menu_id: item.parent, status: 1});
      }

      newRolMenu.push({rol_id: this.rolId, menu_id: item.id, status: 1});

    });

    // console.log(newRolMenu);

    this.rolesService.updateRolMenu(newRolMenu).subscribe(
      data => {},
      error => {},
      () => {
        this.notificationService.showToast('success', 'Confirmación', 'La funcionalidad asociada al rol ha sido creado exitosamente');
      }
    );

    this.closeModal();
  }


  closeModal() {
    this.activeModal.close();
  }
}
