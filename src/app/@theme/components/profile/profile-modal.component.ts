/**
 * Created by harold on 5/22/18.
 */


import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../pages/usuarios/user";
import {UsuariosService} from "../../../pages/usuarios/usuarios.service";
import {NbAuthService} from "../../auth/services/auth.service";
import {NotificationMessageService} from "../message-notification/notification.service";
@Component({
  selector: 'profile-modal',
  templateUrl: 'profile-modal.component.html'
})

export class ProfileModal implements  OnInit {

  modalHeader: string;

  user: User = new User();
  userId: any;

  selectChangePassword: boolean = false;

  constructor(private activeModal: NgbActiveModal, private userService: UsuariosService, private AuthService: NbAuthService, private notificationService: NotificationMessageService,){}

  ngOnInit() {

    this.userId = this.AuthService.getUserId();

    this.userService.getUserInfo(this.userId).subscribe(
      response => {
        let data: any = response.data;
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.phone = data.phone;
        this.user.facebook = data.facebook;
      },
      error => {},
      () => {
      }
    );

  }

  updateUser() {

    this.user.rol_id = -1;
    let data: any = {id: this.userId, data: this.user};

    this.userService.updateUser(data).subscribe(
      response => {},
      error => {},
      () => {
        this.closeModal();
        this.notificationService.showToast('success', 'Confirmación', 'Su perfil ha sido actualizado exitosamente');
      }
    );

  }

  closeModal() {
    this.activeModal.close();
  }

}
