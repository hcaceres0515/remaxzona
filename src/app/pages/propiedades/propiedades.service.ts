import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ServerResponse} from "../../@core/utils/ServerResponse";
import {Injectable} from "@angular/core";
import {PATHS} from "../../@core/config/constanst";
/**
 * Created by harold on 6/3/18.
 */

@Injectable()
export class PropertyService {

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_departments');
  }

  getProvinceByDepartment(depaId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_provinces_by_department&department_id=' + depaId);
  }

  getDistrictByProvince(proId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_districts_by_province&province_id=' + proId);
  }

  getPropertyType(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_type');
  }

  getPropertySubType(propertyType): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_sub_type&property_type_id=' + propertyType);
  }

  getPropertyStatus(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_status');
  }

  getPropertyContract(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_contract');
  }

  getPropertyCoin(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_coin');
  }

  getPropertyTypeFeatures(propertyType): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_type_feature&property_type_id=' + propertyType);
  }

  propertyCreate(propertyData): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=property&m=property_create', propertyData);
  }

  propertyUpdate(propertyData) {
    return this.http.post(PATHS.API + '&c=property&m=property_update', propertyData);
  }

  propertyImageDelete(imageId): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=property&m=delete_property_image', JSON.stringify({'image_id': imageId}));
  }

  propertyFileDelete(fileId): Observable<ServerResponse>{
    return this.http.post(PATHS.API + '&c=property&m=delete_property_file', JSON.stringify({'file_id': fileId}));
  }

  propertyImagesUpdate(images): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=property&m=upload_image', images);
  }

  propertyFilesUpdate(files) {
    return this.http.post(PATHS.API + '&c=property&m=upload_file', files);
  }

  getPropertiesByFilters(filters): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=property&m=get_properties_by_filters', JSON.stringify({'query': filters}));
  }

  getPropertiesByUser(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_properties_by_user&user_id=' + userId);
  }

  getPropertiesByOffice(officeId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_properties_by_office&office_id=' + officeId);
  }

  getPropertyInfoById(propertyId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_info_by_id&property_id=' + propertyId);
  }

  getPropertyNotActive(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_not_active&user_id=' + userId);
  }

  getPropertyDetail(propertyId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_by_id&property_id=' + propertyId);
  }

  getPropertiesVisitsByUser(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_visits_by_user&user_id=' + userId);
  }

  getPropertyVisitDetail(visitId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_visit_by_id&visit_id=' + visitId);
  }

  propertyVisitCreate(visit) {
    return this.http.post(PATHS.API + '&c=property&m=property_visit_create', JSON.stringify(visit));
  }

  propertyVisitUpdate(visit) {
    return this.http.post(PATHS.API + '&c=property&m=property_visit_update', JSON.stringify(visit));
  }

  getAreaMeasurement() {

    let obj = [
      {
        id: '1',
        name: 'ha'
      },
      {
        id: '2',
        name: 'ft'
      },
      {
        id: '3',
        name: 'm2'
      }
    ];

    return obj;
  }

  getVisitRating() {

    let obj = [
      {
        id: '1',
        name: 'Muy Malo'
      },
      {
        id: '2',
        name: 'Malo'
      },
      {
        id: '3',
        name: 'Regular'
      },
      {
        id: '4',
        name: 'Bueno'
      }
    ];

    return obj;
  }

  getChangeContractType() {

    let obj = [
      {
        id: '1',
        name: 'AGENTE'
      },
      {
        id: '2',
        name: 'OTROS MEDIOS'
      },
      {
        id: '3',
        name: 'COMPARTIDO'
      }
    ];

    return obj;
  }
}


export const PROPERTY_TYPE = {

  DEPARTAMENTO: '1',
  CASA: '2',
  TERRENO: '3'

}

export const PROPERTY_CONTRACT_TYPE = {

  ACTIVO: '1',
  DESACTIVO: '2',
  VENDIDO: '3',
  ALQUILADO: '4',
  RESERVADO: '5'

}

export const CHANGE_CONTRACT_TYPE = [

  {
    id: '1',
    name: 'AGENTE'
  },
  {
    id: '2',
    name: 'OTROS MEDIOS'
  },
  {
    id: '3',
    name: 'COMPARTIDO'
  }

]



