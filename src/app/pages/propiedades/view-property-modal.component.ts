import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PropertyService} from "./propiedades.service";
import {Property} from "./property";

@Component({
  selector: 'view-property-modal',
  templateUrl: './view-property-modal.component.html'
})

export class ViewPropertyModalComponent implements  OnInit{

  propertyData: any = [];
  propertyId;

  constructor(private activeModal: NgbActiveModal, private propertyService: PropertyService) {}

  ngOnInit(): void {

    console.log(this.propertyId);

    this.propertyService.getPropertyDetail(this.propertyId).subscribe(
      response => {
        console.log(response);
        this.propertyData = response.data;
      },
      error => {},
      () => {}
    );
  }
  
  closeModal() {
    this.activeModal.close();
  }
}
