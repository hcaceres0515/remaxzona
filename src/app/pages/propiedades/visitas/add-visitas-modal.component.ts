import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PropertyService} from "../propiedades.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PATHS} from "../../../@core/config/constanst";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {PropertyVisit} from "../property";
import {SampleLayoutService} from "../../../@theme/layouts/sample/sample.layout.service";

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
          <label class="col-sm-3 col-form-label">{{visit.created_at | date: 'dd/MM/yyyy'}}</label>
          
        </div> 

        <div class="form-group row">
          <label for="inputCustomer" class="col-sm-3 col-form-label">Cliente *</label>
          
          <div class="col-sm-9" *ngIf="!isView">

            <input ngui-auto-complete type="text" class="form-control" placeholder="Buscar Cliente" 
                   name="customer" 
                   [source]="observableSource.bind(this)"
                   list-formatter="name"
                   no-match-found-text="No hay resultados"
                   (valueChanged)="onCustomerSelected($event)"
            />

            <small class="form-text error" *ngIf="visit.customer_id == 0">
              Campo Requerido
            </small>
            
          </div>

          <label class="col-sm-9 col-form-label" *ngIf="isView">{{customerName}}</label>
          
        </div>

        <div class="form-group row">
          <label for="inputProperty" class="col-sm-3 col-form-label">Codigo de Propiedad *</label>
          <div class="col-sm-3">

            <div class="input-group mail-btn-group">

              <input type="text" class="form-control" name='propertyId' placeholder="1101" [(ngModel)]="propertyId" (keypress)="onlyNumberKey($event)" [disabled]="isView">
              <span class="input-group-btn">
                <button class="btn btn-info btn-icon" title="Buscar por codigo" [disabled]="propertyId == null || propertyId == ''" (click)="searchProperty()" [disabled]="isView">
                  <i class="ion-ios-search"></i>
                </button>
              </span>

            </div>

            <div *ngIf="invalidProperty" class="alert alert-danger">
              {{invalidPropertyMessage}}
            </div>

          </div>
        </div>

        <div class="form-group row">
          <label for="inputPropertyTitle" class="col-sm-3 col-form-label">Título de propiedad *</label>

          <div class="col-sm-9">
            
            <input type="text" class="form-control" name="propertyTitle" disabled [(ngModel)]="propertyData.title">

            <small class="form-text error" *ngIf="visit.property_id == 0">
              Campo Requerido
            </small>
            
          </div>
          
        </div>

        <div class="form-group row">
          <label class="col-sm-4 col-form-label">Propuesta Economica </label>
         
          <div class="col-sm-3">
            <label class="custom-control custom-radio radio-inline">
              <input type="radio" class="custom-control-input" name="bedroomsRadio" [value]="1" [(ngModel)]="visit.offer" [disabled]="isView">
              <span class="custom-control-indicator"></span>
              <span class="custom-control-description"> SI </span>
            </label>

            <label class="custom-control custom-radio radio-inline">
              <input type="radio" class="custom-control-input" name="bedroomsRadio" [value]="0" [(ngModel)]="visit.offer" [disabled]="isView">
              <span class="custom-control-indicator"></span>
              <span class="custom-control-description"> NO </span>
            </label>
  
          </div>
        </div> 

        <div class="form-group row" *ngIf="visit.offer == 1">
          <label class="col-sm-6 col-form-label">Propuesta en firme o negociar con los propietarios *</label>
          <div class="col-sm-2">

            <select name="coin" id="coin" class="form-control" [(ngModel)]="visit.coin_type_id" [disabled]="isView">
              <option *ngFor="let item of propertyCoin" [ngValue]="item.id">{{item.symbol}}</option>
            </select>

          </div>

          <div class="col-sm-3">
            
            <input type="text" class="form-control" name="offerAmount" [(ngModel)]="visit.offer_amount" 
                   required #offerAmount="ngModel" [disabled]="isView">
            
            <small class="form-text error" *ngIf="offerAmount.invalid && offerAmount.touched">
              Campo Requerido
            </small>
            
          </div>

        </div> 

        <div class="form-group row">
          <label class="col-sm-4 col-form-label">Calificación * </label>
          <div class="col-sm-4">

            <select name="rating" class="form-control" [(ngModel)]="visit.rating" required 
              #rating="ngModel" [disabled]="isView">
              <option *ngFor="let item of visitRating" [ngValue]="item.id">{{item.name}}</option>
            </select>

            <small class="form-text error" *ngIf="rating.invalid && rating.touched">
              Campo Requerido
            </small>
            
          </div>

        </div> 

        <div class="form-group row">
          <label for="observations" class="col-sm-3 col-form-label">Observaciones </label>
          <div class="col-sm-9">

            <textarea name="observation" class="form-control" cols="30" rows="4" [(ngModel)]="visit.comments" [disabled]="isView"></textarea>

          </div>
        </div>           
        
      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!(visitAddForm.form.valid) || !(visit.customer_id) || !(visit.property_id)" (click)="createVisit()"> <i class="fa fa-save"></i>  Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" [disabled]="!visitAddForm.form.valid" (click)="updateVisit()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
	`,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    ngui-auto-complete {
      z-index: 100 !important;
    }
  `]
})

export class AddVisitasModalComponent implements OnInit{

	modalHeader: string;
	isView: boolean = false;
	isEdit: boolean = false;

	propertyData: any = [];
  propertyCoin: any[];
  visitRating: any[];

  propertyId: any;
  customerName: string;
  invalidProperty: boolean = false;
  invalidPropertyMessage: string = '';

  visit = new PropertyVisit();

  @Output() clickSave: EventEmitter<any> = new EventEmitter();
  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal, private propertyService: PropertyService,
              private http: HttpClient, private authService: NbAuthService, private sampleLayoutService: SampleLayoutService){

    this.getVisitRating();
    this.getPropertyCoin();
    this.visit.offer = 1;
    this.visit.created_at = new Date();
    this.visit.customer_id = 0;
    this.visit.property_id = 0;

  }

  ngOnInit() {

    // console.log('init visit modal');
  }

  getPropertyCoin() {

    this.propertyService.getPropertyCoin().subscribe(
      response => {this.propertyCoin = response.data},
      error => {},
      () => {
        this.visit.coin_type_id = this.propertyCoin[0].id;
      }
    );
  }

  getVisitRating() {

    this.visitRating =  this.propertyService.getVisitRating();

  }

  createVisit() {

    this.visit.user_id = this.authService.getUserId();
    this.visit.office_id = this.authService.getOfficeId();
    this.visit.status = 1;
    console.log(this.visit);

    this.sampleLayoutService.onSetLoadingIcon.emit(true);

    this.propertyService.propertyVisitCreate(this.visit).subscribe(
      response => {
      },
      error => {},
      () => {
        this.clickSave.emit();
        this.closeModal();
        this.sampleLayoutService.onSetLoadingIcon.emit(false);
      }
    );

  }

  updateVisit() {

    this.propertyService.propertyVisitUpdate(this.visit).subscribe(
      response => {},
      error => {},
      () => {
        this.clickUpdate.emit();
        this.closeModal();
      }
    );

  }

  observableSource = (keyword: any): Observable<any[]> => {
    let url: string =
      PATHS.API + '&c=customer&m=get_customer_by_keyword&user_id=' + this.authService.getUserId() + '&keyword=' + keyword
    if (keyword) {
      let json;
      return this.http.get(url)
        .map(res => {
          let json = res;
          return json;
        })
    } else {
      return Observable.of([]);
    }
  }

  onCustomerSelected(customer) {
    // this.selectedCustomer = customer;
    // console.log(customer);
    this.visit.customer_id = customer.id;
  }

  onlyNumberKey(event) {

    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;

  }

  searchProperty() {

    let properties: any = [];

    if (this.propertyId != null) {

      this.propertyService.getPropertyInfoById(this.propertyId).subscribe(
        response => {
          this.propertyData = response.data;
          this.visit.property_id = this.propertyData.id;
        },
        error => {
          this.invalidProperty = true;
          this.invalidPropertyMessage = 'El código de la propiedad no existe';
          setTimeout(function() {
            this.invalidProperty = false;
          }.bind(this), 3000);
        },
        () => {
          // console.log(this.properties);
        }
      );
    }
  }

  loadNgModel(data) {

    if (this.isEdit) {
      this.visit.id = data.id;
    }

    // this.visit.offer = 0;
    // this.visit = data;
    this.visit.customer_id = data.customer_id;
    this.visit.comments = data.comments;
    this.visit.coin_type_id = +data.coin_type_id;
    this.visit.offer_amount = data.offer_amount;
    this.visit.offer = +data.offer;
    this.visit.property_id = +data.property_id;
    this.visit.rating = data.rating;
    this.propertyData.title = data.title;
    this.propertyId = data.property_id;
    this.customerName = data.customer_name;

    console.log(this.visit, data);
  }

	closeModal() {
    	this.activeModal.close();
  }

}
