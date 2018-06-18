import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'view-property-modal',
  templateUrl: './view-property-modal.component.html'
})

export class ViewPropertyModalComponent {

  constructor(private activeModal: NgbActiveModal) {}


  closeModal() {
    this.activeModal.close();
  }
}
