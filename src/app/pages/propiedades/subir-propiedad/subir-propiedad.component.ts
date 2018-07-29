/**
 * Created by harold on 6/4/18.
 */
import {Component, ElementRef, OnInit, ViewChild, NgZone} from "@angular/core";
import {PROPERTY_CONTRACT_TYPE, PROPERTY_TYPE, PropertyService} from "../propiedades.service";
import {PATHS} from "../../../@core/config/constanst";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AddClientesModalComponent} from "../../clientes/mis-clientes/add-clientes-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl} from "@angular/forms";
import {MapsAPILoader} from "@agm/core";
import {} from "googlemaps";
import {Property} from "../property";
import {NbAuthService} from "../../../@theme/auth/services/auth.service";
import {propertyType} from "@angular/language-service/src/html_info";
import {GeolocationService} from "../../../@core/utils/geolocation/geolocation.service";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {Router} from "@angular/router";
import {SampleLayoutService} from "../../../@theme/layouts/sample/sample.layout.service";

@Component({
  selector: 'add-property',
  styleUrls: ['subir-propiedad.scss'],
  templateUrl: 'subir-propiedad.component.html'
})

export class SubirPropiedadComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public lat: number;
  public lng: number;
  public searchControl: FormControl;
  public zoom: number;
  public marker: string = PATHS.MAP_ICON;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  public validationMessages:any = [];

  PROPERTY_TYPE = PROPERTY_TYPE;

  propertyData: Property = new Property();
  propertyId: number;

  departments: any[];
  provinces: any[];
  districts: any[];
  propertyType: any[];
  propertySubType: any[] = [];
  propertyStatus: any[];
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

  selectedPropertyType: any = [];
  selectedPropertyStatus: any;
  selectedPropertyContract: any;
  selectedPropertyCoin: any;

  selectedLocation: boolean = false;
  notificationsConfig: boolean = false;

  floorsLabel: string = 'Pisos';

  constructor(private propertyService: PropertyService, private _http: HttpClient, private modalService: NgbModal,
              private mapsAPILoader: MapsAPILoader, private authService: NbAuthService,
              private ngZone: NgZone, private geolocationService: GeolocationService,
              private notificationService: NotificationMessageService, private router: Router, private  sampleLayoutService: SampleLayoutService) {}

  ngOnInit() {

    this.getDepartments();
    this.getPropertyType();
    this.getPropertyStatus();
    // this.getPropertyContract();
    this.getPropertyCoin();

    this.areaType = this.propertyService.getAreaMeasurement();
    this.areaBuiltType = this.propertyService.getAreaMeasurement();

    // this.propertyData.area_built_type = this.areaBuiltType[0];
    // this.propertyData.area_type = this.areaType[0];

    this.propertyData.report_days = '7'; //Default value

    this.propertyData.report_visits = 0;

    this.zoom = 12;

    //create search FormControl
    this.searchControl = new FormControl();

    this.geolocationService.getLocation().subscribe(
      position => {
        this.latitude = +position.latitude;
        this.longitude = +position.longitude;
        this.lat = +position.latitude;
        this.lng = +position.longitude;
      }
    );

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

  mapClick(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.propertyData.lat = (this.lat) + '';
    this.propertyData.lng = (this.lng) + '';

    this.selectedLocation = true;
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
    console.log(department);
    this.propertyService.getProvinceByDepartment(department.id).subscribe(
      response => {this.provinces = response.data},
      error => {},
      () => {
        this.selectedProvince = this.provinces[0];
        this.onChangeProvince(this.selectedProvince);
      }
    );
  }

  onChangeProvince(province) {
    this.propertyService.getDistrictByProvince(province.id).subscribe(
      response => {this.districts = response.data},
      error => {},
      () => {
        this.selectedDistrict = this.districts[0];
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

  onChangePropertyType(value) {

    this.getPropertyTypeFeatures(value.id);
    this.getPropertySubType(value.id);

    this.propertyData.bedrooms = '';
    this.propertyData.bathrooms = '';
    this.propertyData.floors = '';
    this.propertyData.parkings = '';

    if (value.id == PROPERTY_TYPE.DEPARTAMENTO) {
      this.floorsLabel = 'N - Piso';
    } else {
      this.floorsLabel = 'Pisos';
    }
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
        this.selectedPropertyCoin = this.propertyCoin[0];
      }
    );
  }

  createProperty(form) {

    // console.log(this.propertyData);

    this.validationMessages = [];

    if (!form.valid) {
      this.validationMessages.push('Ingrese los todos datos obligatorios');
    }

    if (this.selectedImages.length == 0) {
      this.validationMessages.push('Ingrese por lo menos una imagen');
    }

    if (this.propertyData.customer_id == 0 || this.propertyData.customer_id == null) {
      this.validationMessages.push('Ingrese el propietario');
    }

    if (!this.selectedLocation) {
      this.validationMessages.push('Seleccione una ubicación de referencia en el mapa');
    }

    if (this.validationMessages.length == 0) {

      this.sampleLayoutService.onSetLoadingIcon.emit(true);

      this.propertyData.user_id = this.authService.getUserId();
      this.propertyData.office_id = this.authService.getOfficeId();
      this.propertyData.title = this.propertyData.title.toUpperCase();
      this.propertyData.property_type_id = this.selectedPropertyType.id;
      this.propertyData.property_status_id = this.selectedPropertyStatus.id;
      this.propertyData.property_contract_id = +PROPERTY_CONTRACT_TYPE.ACTIVO;
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

      this.propertyService.propertyCreate(fd).subscribe(
        response => {},
        error => {},
        () => {
          this.notificationService.showToast('success', 'Confirmación', 'La propiedad ha sido creada exitosamente');
          this.sampleLayoutService.onSetLoadingIcon.emit(false);
          this.router.navigate(['/pages/propiedades/mis-propiedades']);
        }
      );

    }

  }

  propertyImagesUpload() {

    let fd: FormData = new FormData();

    let files = this.selectedImages;

    for (let item of files) {
      fd.append('file[]', item, item.name);
    }

    fd.append('property_id', this.propertyId.toString());

    this.propertyService.propertyImagesUpdate(fd).subscribe(
      response => {},
      error => {},
      () => {}
    );
  }

  propertyFilesUpload() {

    let fd: FormData = new FormData();

    let files = this.selectedAttachFile;

    for (let item of files) {
      fd.append('file[]', item, item.name);
    }

    fd.append('property_id', this.propertyId.toString());

    this.propertyService.propertyFilesUpdate(fd).subscribe(
      response => {},
      error => {},
      () => {}
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

  observableSource = (keyword: any): Observable<any[]> => {
    let url: string =
      PATHS.API + '&c=customer&m=get_customer_by_keyword&user_id=' + this.authService.getUserId() + '&keyword=' + keyword
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

  onCustomerSelected(customer) {
    this.selectedCustomer = customer;
    this.propertyData.customer_id = customer.id;

  }

  showAddCustomerrModal() {

    const activeModal = this.modalService.open(AddClientesModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Agregar Cliente';

    activeModal.componentInstance.clickSave.subscribe((customer) => {
      this.selectedCustomer.name = customer.name;
      this.selectedCustomer.email = customer.email;
      this.selectedCustomer.first_phone = customer.first_phone;
      this.propertyData.customer_id = customer.id;

      this.notificationService.showToast('success', 'Confirmación', 'El cliente ha sido creado exitosamente');

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

  deletePropertyImage(index) {
    this.selectedImageFilePreview.splice(index, 1);
  }

  deleteAttachFile(index) {
    this.selectedAttachFilePreview.splice(index, 1);
  }

}
