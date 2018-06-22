import {Component, EventEmitter, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PropertyService} from "../propiedades.service";

@Component({
	selector: 'add-visitas-modal',
	template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">


      <form #visitAddForm="ngForm" novalidate>

      	<div class="form-group row">
          
          <label class="col-sm-3 col-form-label">Fecha</label>
          <label class="col-sm-3 col-form-label">18/06/2018</label>
          
        </div> 

        <div class="form-group row">
          <label for="inputName" class="col-sm-3 col-form-label">Nombre y Apellidos *</label>
          <div class="col-sm-9">
            
          </div>
        </div>     

        <div class="form-group row">
          <label class="col-sm-4 col-form-label">Propuesta Economica </label>
          <div class="col-sm-8">


          </div>
        </div> 

        <div class="form-group row">
          <label class="col-sm-6 col-form-label">Propuesta en firme o negociar con los propietarios </label>
          <div class="col-sm-2">

            <select name="coin" id="coin" class="form-control" [(ngModel)]="selectedPropertyCoin">
              <option *ngFor="let item of propertyCoin" [ngValue]="item">{{item.symbol}}</option>
            </select>

          </div>

          <div class="col-sm-2">
          </div>

        </div> 

        <div class="form-group row">
          <label class="col-sm-6 col-form-label">Calificacion </label>
          <div class="col-sm-2">

            <select name="calification" id="calification" class="form-control">
              <option *ngFor="let item of visitCalification" [ngValue]="item">{{item.symbol}}</option>
            </select>

          </div>

        </div> 

        <div class="form-group row">
          <label for="inputName" class="col-sm-3 col-form-label">Observaciones </label>
          <div class="col-sm-9">

            

          </div>
        </div>           
        
      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!visitAddForm.form.valid" (click)="createVisit()"> <i class="fa fa-save"></i>  Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" [disabled]="!visitAddForm.form.valid" (click)="updateVisit()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
	`
})

export class AddVisitasModalComponent {

	modalHeader: string;
	isView: boolean = false;
	isEdit: boolean = false;

  selectedPropertyCoin: any;
  propertyCoin: any[];
  visitCalification: any[];

  	@Output() clickSave: EventEmitter<any> = new EventEmitter();
  	@Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  	constructor(private activeModal: NgbActiveModal, private propertyService: PropertyService){}


    getPropertyCoin() {

      this.propertyService.getPropertyCoin().subscribe(
        response => {this.propertyCoin = response.data},
        error => {},
        () => {
          this.selectedPropertyCoin = this.propertyCoin[0];
        }
      );
    }

    getVisitCalification() {

      this.visitCalification =  this.propertyService.getVisitCalification();

    }

    createCalification() {

    }

    updtateCalification() {

    }

	closeModal() {
    	this.activeModal.close();
  }

}
