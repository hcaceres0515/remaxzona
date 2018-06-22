import {Component, EventEmitter, Output, OnInit, ViewChild, NgZone, ElementRef} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {MapsAPILoader} from "@agm/core";
import {} from "googlemaps";
import {Property} from "./property";
import {PROPERTY_TYPE, PropertyService} from "./propiedades.service";
import {NbAuthService} from "../../@theme/auth/services/auth.service";
import {PATHS} from "../../@core/config/constanst";
import {AddClientesModalComponent} from "../clientes/mis-clientes/add-clientes-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationMessageService} from "../../@theme/components/message-notification/notification.service";
/**
 * Created by harold on 6/13/18.
 */

@Component({
  selector: 'edit-property-modal',
  styleUrls: ['./subir-propiedad/subir-propiedad.scss'],
  templateUrl: './edit-property.component.html',
})

export class EditPropertyComponent {

  public latitude: number;
  public longitude: number;
  public lat: number;
  public lng: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  loadedData: boolean = false;

  public validationMessages:any = [];

  PROPERTY_TYPE = PROPERTY_TYPE;

  // propertyData: Property = new Property();
  public sub;
  public propertyId: number;
  propertyData: any = [];

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
  selectedImages: any = [];
  selectedAttachFile: any = [];

  selectedDepartment: any;
  selectedProvince: any;
  selectedDistrict: any;

  selectedCustomer: any = {name:'', email:'', first_phone:''};

  selectedPropertyType: any = {name: ''};
  selectedPropertyStatus: any;
  selectedPropertyContract: any;
  selectedPropertyCoin: any;

  notificationsConfig: boolean = false;

  constructor(private authService: NbAuthService, private activeRoute: ActivatedRoute,
              private propertyService: PropertyService, private _http: HttpClient, private modalService: NgbModal,
              private mapsAPILoader: MapsAPILoader, private notificationService: NotificationMessageService,
              private ngZone: NgZone, private router: Router) {}

  ngOnInit() {

    this.sub = this.activeRoute.params.subscribe(params => {
      this.propertyId = +params['property_id']; // (+) converts string 'id' to a number
    });


    this.propertyService.getPropertyDetail(this.propertyId).subscribe(
      response => {
        this.propertyData = response.data;
      },
      error => {},
      () => {

        console.log(this.propertyData);

        if (this.propertyData.user_id != this.authService.getUserId()) {

          // this.router.navigate(['/pages/properties']);
          alert('Diferent');

        } else {

          this.loadedData = true;
          this.selectedCustomer.id = this.propertyData.customer_id;
          this.selectedCustomer.name = this.propertyData.customer_name;
          this.selectedCustomer.email = this.propertyData.customer_email;
          this.latitude = +this.propertyData.lat;
          this.longitude = +this.propertyData.lng;
          this.lat = this.latitude;
          this.lng = this.longitude;

          this.getDepartments();
          this.getPropertyType();
          this.getPropertyStatus();
          this.getPropertyContract();
          this.getPropertyCoin();

        }
      }
    );

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
        console.log(this.departments);
        let index = this.departments.map(function(e) { return e.id; }).indexOf(this.propertyData.department_id);
        this.selectedDepartment = this.departments[index];
        this.onChangeDepartment(this.selectedDepartment);
      }
    );
  }

  onChangeDepartment(department) {
    this.propertyService.getProvinceByDepartment(department.id).subscribe(
      response => {this.provinces = response.data},
      error => {},
      () => {
        if (this.loadedData) {
          let index = this.provinces.map(function(e) { return e.id; }).indexOf(this.propertyData.province_id);
          this.selectedProvince = this.provinces[index];
        } else {
          this.selectedProvince = this.provinces[0];
        }
        this.onChangeProvince(this.selectedProvince);
      }
    );
  }

  onChangeProvince(province) {
    this.propertyService.getDistrictByProvince(province.id).subscribe(
      response => {this.districts = response.data},
      error => {},
      () => {
        if (this.loadedData) {
          let index = this.districts.map(function(e) { return e.id; }).indexOf(this.propertyData.district_id);
          this.selectedDistrict = this.districts[index];
        } else {
          this.selectedDistrict = this.districts[0];
        }
        this.loadedData = false;
      }
    );
  }

  getPropertyType() {
    this.propertyService.getPropertyType().subscribe(
      response => {this.propertyType = response.data},
      error => {},
      () => {
        let index = this.propertyType.map(function(e) { return e.id; }).indexOf(this.propertyData.property_type_id);
        this.selectedPropertyType = this.propertyType[index];
        this.getPropertySubType(this.selectedPropertyType.id);
        this.getPropertyTypeFeatures(this.selectedPropertyType.id);
      }
    );
  }

  getPropertyStatus() {
    this.propertyService.getPropertyStatus().subscribe(
      response => {this.propertyStatus = response.data},
      error => {},
      () => {
        let index = this.propertyStatus.map(function(e) { return e.id; }).indexOf(this.propertyData.property_status_id);
        this.selectedPropertyStatus = this.propertyStatus[index];
      }
    );
  }

  getPropertyContract() {
    this.propertyService.getPropertyContract().subscribe(
      response => {this.propertyContract = response.data},
      error => {},
      () => {
        let index = this.propertyContract.map(function(e) { return e.id; }).indexOf(this.propertyData.property_contract_id);
        this.selectedPropertyContract = this.propertyContract[index];
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

        if (typeId == this.propertyData.property_type_id) {

          (this.propertyTypeFeatures).forEach((item)=> {
            // item.checked = false;
            let feature = this.propertyData.features.find(x => x.property_type_feature_id === item.id);

            if (feature !== undefined) {
              item.checked = true;
            } else {
              item.checked = false;
            }

          });
          console.log('PropertyFeatures', this.propertyTypeFeatures);

        }

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
        let index = this.propertyCoin.map(function(e) { return e.id; }).indexOf(this.propertyData.property_coin_id);
        this.selectedPropertyCoin = this.propertyCoin[index];
      }
    );
  }

  selectPropertyFeatures(value, event) {
    if (event.target.checked) {
      this.propertyData.features.push(value);
    } else {
      let i = this.propertyData.features.indexOf(value);
      this.propertyData.features.splice(i, 1);
    }

    console.log(this.propertyData.features);
  }

  updateProperty(form) {

    this.validationMessages = [];

    if (!form.valid) {
      this.validationMessages.push('Ingrese los todos datos obligatorios');
    }

    if (this.selectedImages.length == 0 && this.propertyData.images.length == 0) {
      this.validationMessages.push('Ingrese por lo menos una imagen');
    }

    if (this.propertyData.customer_id == 0 || this.propertyData.customer_id == null) {
      this.validationMessages.push('Ingrese el propietario');
    }

    if (this.validationMessages.length == 0) {

      this.propertyData.user_id = this.authService.getUserId();
      this.propertyData.office_id = this.authService.getOfficeId();
      this.propertyData.title = this.propertyData.title.toUpperCase();
      this.propertyData.property_type_id = this.selectedPropertyType.id;
      this.propertyData.property_status_id = this.selectedPropertyStatus.id;
      this.propertyData.property_contract_id = this.selectedPropertyContract.id;
      this.propertyData.department_id = this.selectedDepartment.id;
      this.propertyData.province_id = this.selectedProvince.id;
      this.propertyData.district_id = this.selectedDistrict.id;
      this.propertyData.property_coin_id = this.selectedPropertyCoin.id;

      let fd: FormData = new FormData();

      let images = this.selectedImages;

      for (let item of images) {
        fd.append('image[]', item, item.name);
      }

      let files = this.selectedAttachFile;

      for (let item of files) {
        fd.append('file[]', item, item.name);
      }

      fd.append('property_data', JSON.stringify(this.propertyData));

      console.log(this.propertyData, fd);

      this.propertyService.propertyUpdate(fd).subscribe(
        response => {},
        error => {},
        () => {
          this.notificationService.showToast('success', 'Confirmación', 'La propiedad ha sido actualizada exitosamente');
          this.router.navigate(['/pages/propiedades/mis-propiedades']);
        }
      );

    }

  }

  mapClick(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.propertyData.lat = (this.lat) + '';
    this.propertyData.lng = (this.lng) + '';
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

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.notificationService.showToast('success', 'Confirmación', 'El usuario ha sido creado exitosamente');
    });

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

    this.selectedImages = event.target.files;

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
    this.selectedAttachFile = event.target.files;

    console.log(event.target.files);

    if (files) {
      for (let file of files) {
        this.selectedAttachFilePreview.push(file);
      }
    }

  }

  deletePropertyImage(imageId, index) {

    console.log(index);

    this.propertyService.propertyImageDelete(imageId).subscribe(
      response => {},
      error => {},
      () => {
        this.propertyData.images.splice(index, 1);
      }
    );

  }

  deletePropertyImagePreview(index) {
    this.selectedImageFilePreview.splice(index, 1);
  }

  deleteAttachFile(fileId, index) {

    this.propertyService.propertyFileDelete(fileId).subscribe(
      response => {},
      error => {},
      () => {
        this.propertyData.files.splice(index, 1);
      }
    );

  }

  deleteAttachFilePreview(index) {
    this.selectedAttachFilePreview.splice(index, 1);
  }



}
