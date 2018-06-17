import {Component, EventEmitter, Output, OnInit, ViewChild, NgZone, ElementRef} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {MapsAPILoader} from "@agm/core";
import {} from "googlemaps";
import {Property} from "./property";
import {PropertyService} from "./propiedades.service";
import {NbAuthService} from "../../@theme/auth/services/auth.service";
import {PATHS} from "../../@core/config/constanst";
import {AddClientesModalComponent} from "../clientes/mis-clientes/add-clientes-modal.component";
/**
 * Created by harold on 6/13/18.
 */

@Component({
  selector: 'edit-property-modal',
  templateUrl: 'edit-property-modal.component.html',
})

export class EditPropertyModalComponent {

  modalHeader: string;

  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  // lat = 51.678418;
  // lng = 7.809007;

  propertyData: Property = new Property();

  departments: any[];
  provinces: any[];
  districts: any[];
  propertyType: any[];
  propertySubType: any[];
  propertyStatus: any[];
  propertyContract: any[];
  propertyCoin: any[];
  propertyTypeFeatures: any[];
  areaType: any[];
  areaBuiltType: any[];

  selectedAttachFilePreview: any[] = [];
  selectedImageFilePreview: any[] = [];

  selectedDepartment: any;
  selectedProvince: any;
  selectedDistrict: any;

  selectedPropertyType: any = {name: ''};
  selectedPropertyStatus: any;
  selectedPropertyContract: any;
  selectedPropertyCoin: any;

  notificationsConfig: boolean = false;

  constructor(private activeModal: NgbActiveModal, private authService: NbAuthService,
              private propertyService: PropertyService, private _http: HttpClient, private modalService: NgbModal,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {}

  ngOnInit() {

    this.getDepartments();
    this.getPropertyType();
    this.getPropertyStatus();
    this.getPropertyContract();
    this.getPropertyCoin();

    this.areaType = this.propertyService.getAreaMeasurement();
    this.areaBuiltType = this.propertyService.getAreaMeasurement();

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  getDepartments() {
    this.propertyService.getDepartments().subscribe(
      response => {this.departments = response.data},
      error => {},
      () => {

      }
    );
  }

  onChangeDepartment(department) {
    this.propertyService.getProvinceByDepartment(department.id).subscribe(
      response => {this.provinces = response.data},
      error => {},
      () => {

      }
    );
  }

  onChangeProvince(province) {
    this.propertyService.getDistrictByProvince(province.id).subscribe(
      response => {this.districts = response.data},
      error => {},
      () => {

      }
    );
  }

  getPropertyType() {
    this.propertyService.getPropertyType().subscribe(
      response => {this.propertyType = response.data},
      error => {},
      () => {

      }
    );
  }

  getPropertyStatus() {
    this.propertyService.getPropertyStatus().subscribe(
      response => {this.propertyStatus = response.data},
      error => {},
      () => {

      }
    );
  }

  getPropertyContract() {
    this.propertyService.getPropertyContract().subscribe(
      response => {this.propertyContract = response.data},
      error => {},
      () => {

      }
    );
  }

  onChangePropertyType(value) {

    this.getPropertyTypeFeatures(value.id);
    this.getPropertySubType(value.id);
  }

  getPropertyTypeFeatures(typeId) {

    this.propertyService.getPropertyTypeFeatures(typeId).subscribe(
      response => {this.propertyTypeFeatures = response.data},
      error => {},
      () => {
        console.log(this.propertyTypeFeatures);
      }
    );
  }

  getPropertySubType(typeId) {

    this.propertyService.getPropertySubType(typeId).subscribe(
      response => {this.propertySubType = response.data},
      error => {},
      () => {
        console.log(this.propertySubType);
      }
    );
  }

  getPropertyCoin() {
    this.propertyService.getPropertyCoin().subscribe(
      response => {this.propertyCoin = response.data},
      error => {},
      () => {

      }
    );
  }

  updateProperty(form) {

    if (form.valid) {
      console.log('valid');
    } else {
      console.log('no valid');
    }

    // this.propertyData.title = this.propertyData.title.toUpperCase();
    // this.propertyData.property_type_id = this.selectedPropertyType.id;
    // this.propertyData.property_status_id = this.selectedPropertyStatus.id;
    // this.propertyData.property_contract_id = this.selectedPropertyContract.id;
    // this.propertyData.department_id = this.selectedDepartment.id;
    // this.propertyData.province_id = this.selectedProvince.id;
    // this.propertyData.district_id = this.selectedDistrict.id;
    // this.propertyData.property_coin_id = this.selectedPropertyCoin.id;

    console.log(this.propertyData);

  }

  observableSource = (keyword: any): Observable<any[]> => {
    let url: string =
      PATHS.API + '&c=customer&m=get_customer_by_keyword&user_id=' + 2 + '&keyword=' + keyword
    if (keyword) {
      let json;
      return this._http.get(url)
        .map(res => {
          let json = res;
          return json;
        })
    } else {
      return Observable.of([]);
    }
  }

  showAddCustomerrModal() {

    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Agregar Cliente';

    // activeModal.componentInstance.clickSave.subscribe(() => {
    //   this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido creado exitosamente');
    // });

  }

  handleChangeNotifications(value) {

    if (value) {
      this.notificationsConfig = true;
    } else {
      this.propertyData.report_days = null;
      this.notificationsConfig = false;
    }
  }

  onImageFileSelected(event): void {
    let files = event.target.files;

    if (files) {
      for (let file of files) {
        let reader = new FileReader();

        reader.onload = (event: any) => {
          this.selectedImageFilePreview.push(event.target.result);
        }

        reader.readAsDataURL(file);
      }
    }
    console.log(event);
  }

  onAttachFileSelected(event) {

    let files = event.target.files;
    // this.selectedAttachFilePreview = event.target.files;

    console.log(event.target.files);

    if (files) {
      for (let file of files) {
        this.selectedAttachFilePreview.push(file);
      }
    }

  }

  deletePropertyImage(index) {
    this.selectedImageFilePreview.splice(index, 1);
  }

  deleteAttachFile(index) {
    this.selectedAttachFilePreview.splice(index, 1);
  }

  closeModal() {
    this.activeModal.close();
  }

}
