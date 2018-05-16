/**
 * Created by harold on 5/12/18.
 */


import {Component} from "@angular/core";
import {BodyOutputType, Toast, ToasterConfig, ToasterService} from "angular2-toaster";
import {NotificationMessageService} from "./notification.service";
@Component({
  selector: 'ngx-messages-notifications',
  template: `<toaster-container [toasterconfig]="config"></toaster-container>`
})

export class NotificationsMessagesComponent{

  config: ToasterConfig;

  position = 'toast-top-right';
  animationType = 'fade';
  timeout = 5000;
  toastsLimit = 5;
  type = 'success';

  isNewestOnTop = true;
  isHideOnClick = true;
  isDuplicatesPrevented = false;
  isCloseButton = true;

  constructor(private toasterService: ToasterService, private notificationService: NotificationMessageService){
    console.log("init Messages Notifications");

    this.config = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: this.isNewestOnTop,
      tapToDismiss: this.isHideOnClick,
      preventDuplicates: this.isDuplicatesPrevented,
      animation: this.animationType,
      limit: this.toastsLimit,
    });

    // this.showToast('success', 'hi', `I'm cool toaster!`);

    this.notificationService.notificationComponentShowToast$.subscribe(
      data => {

        let type = data.type;
        let title =  data.title;
        let body = data.body;

        this.showToast(type, title, body);
      }
    );
  }

  private showToast(type: string, title: string, body: string) {
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: this.isCloseButton,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

}
