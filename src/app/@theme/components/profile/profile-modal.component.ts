/**
 * Created by harold on 5/22/18.
 */


import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../pages/usuarios/user";
import {UsuariosService} from "../../../pages/usuarios/usuarios.service";
import {NbAuthService} from "../../auth/services/auth.service";
import {NotificationMessageService} from "../message-notification/notification.service";
import {PATHS} from "../../../@core/config/constanst";
import { FileUploader } from 'ng2-file-upload';
import {HttpClient, HttpHeaders, HttpEventType} from "@angular/common/http";

@Component({
  selector: 'profile-modal',
  templateUrl: 'profile-modal.component.html',
})

export class ProfileModal implements  OnInit {

  modalHeader: string;

  user: User = new User();
  userId: any;

  url = PATHS.API + '&c=user&m=upload_image';

  selectedFile: File = null;

  selectChangePassword: boolean = false;

  constructor(private activeModal: NgbActiveModal, private userService: UsuariosService, private AuthService: NbAuthService, private notificationService: NotificationMessageService, private http: HttpClient){}

  ngOnInit() {

    this.userId = this.AuthService.getUserId();

    this.userService.getUserInfo(this.userId).subscribe(
      response => {
        let data: any = response.data;
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.phone = data.phone;
        this.user.facebook = data.facebook;
        this.user.profile_photo = data.path_user_photo;
        console.log(this.user);
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

  onFileSelected(event): void {
    this.selectedFile = <File>event.target.files[0];

    let reader = new FileReader();

    reader.onload = (event: any) => {
      this.user.profile_photo = event.target.result;
    }

    reader.readAsDataURL(event.target.files[0]);

    console.log(event);
  }

  onUpload() {

    let fd: FormData = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    fd.append('user_id', this.userId);

    console.log(fd);

    // let headers = new HttpHeaders({'Content-Type': undefined });

    this.http.post(this.url,fd,{
      reportProgress: true,
      observe: 'events'
    }).subscribe(
      response => {
        console.log(response);
        if (response.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(response.loaded / response.total) * 100);
        } else if (response.type === HttpEventType.Response) {
          console.log('Response');
        }
      },
      error => {

      },
      () => {

      }
    );
  }

  closeModal() {
    this.activeModal.close();
  }

}
