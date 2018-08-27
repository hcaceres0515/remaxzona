import {Component, Input, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {PATHS} from "../../../@core/config/constanst";
import { ViewPropertyModalComponent } from "../../propiedades/view-property-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ngx-kitten',
  styleUrls: ['./kitten.component.scss'],
  templateUrl: './kitten.component.html',
})
export class KittenComponent implements OnDestroy {

  currentTheme: string;
  themeSubscription: any;
  PATHS = PATHS;

  @Input('data') data: any;

  constructor(private themeService: NbThemeService, private modalService: NgbModal) {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  showViewModal() {

    // const activeModal = this.modalService.open(ViewPropertyModalComponent, { size: 'lg', container: 'nb-layout'});
    //
    // activeModal.componentInstance.modalHeader = 'Ver Propiedad';
    // activeModal.componentInstance.propertyId = this.data.id;

  }
}
