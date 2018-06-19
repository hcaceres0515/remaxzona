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
    return this.http.get(PATHS.API + '&c=property&m=get_property_type_feature&property_type_id=' + imageId);
  }

  propertyFileDelete(fileId): Observable<ServerResponse>{
    return this.http.get(PATHS.API + '&c=property&m=get_property_type_feature&property_type_id=' + fileId);
  }

  propertyImagesUpdate(images): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=property&m=upload_image', images);
  }

  propertyFilesUpdate(files) {
    return this.http.post(PATHS.API + '&c=property&m=upload_file', files);
  }

  getPropertiesByUser(userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_properties_by_user&user_id=' + userId);
  }

  getPropertyDetail(propertyId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_property_by_id&property_id=' + propertyId);
  }

  getPropertyVisitsByUser(propertyId, userId): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=property&m=get_properties_by_user&property_id=' + propertyId);
  }

  propertyVisitCreate() {

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
}


export const PROPERTY_TYPE = {

  DEPARTAMENTO: '1',
  CASA: '2',
  TERRENO: '3'

}
