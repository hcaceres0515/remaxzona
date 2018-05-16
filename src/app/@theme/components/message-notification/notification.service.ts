import {BodyOutputType, Toast, ToasterConfig, ToasterService} from "angular2-toaster";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
/**
 * Created by harold on 5/12/18.
 */

@Injectable()
export class NotificationMessageService {

  config: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  title = 'HI there!';
  content = `I'm cool toaster!`;
  timeout = 5000;
  toastsLimit = 5;
  type = 'success';

  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;

  private notificationComponent = new Subject<any>();

  notificationComponentShowToast$ = this.notificationComponent.asObservable();

  showToast(type, title, body) {
    let data = {type: type, title: title, body: body};
    this.notificationComponent.next(data);
  }

  // public showToast(type: string, title: string, body: string) {
  //
  //   // this.config = new ToasterConfig({
  //   //   positionClass: this.position,
  //   //   timeout: this.timeout,
  //   //   newestOnTop: this.isNewestOnTop,
  //   //   tapToDismiss: this.isHideOnClick,
  //   //   preventDuplicates: this.isDuplicatesPrevented,
  //   //   animation: this.animationType,
  //   //   limit: this.toastsLimit,
  //   // });
  //
  //   const toast: Toast = {
  //     type: type,
  //     title: title,
  //     body: body,
  //     timeout: this.timeout,
  //     showCloseButton: this.isCloseButton,
  //     bodyOutputType: BodyOutputType.TrustedHtml,
  //   };
  //   this.toasterService.popAsync(toast);
  // }

}
