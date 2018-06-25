/**
 * Created by harold on 6/6/18.
 */

export class Property {

  //noinspection TsLint
  public id: number;
  public user_id: number;
  public office_id: number;
  public username: string;
  public customer_id: number;
  public department_id: number;
  public province_id: number;
  public district_id: number;
  public property_type_id: number;
  public property_status_id: number;
  public property_contract_id: number;
  public property_coin_id: number;
  public customer_name: string;
  public customer_email: string;
  public customer_first_phone: string;
  public department_name: string;
  public province_name: string;
  public district_name: string;
  public property_type_name: string;
  public property_status_name: string;
  public property_contract_name: string;
  public property_coin_symbol: string;
  public exclusivity: number;
  public title: string;
  public description: string;
  public price: string;
  public commission_percentage: string;
  public commission_amount: string;
  public bedrooms: string;
  public bathrooms: string;
  public floors: string;
  public years: string;
  public antiquity: string;
  public parkings: string;
  public address: string;
  public reference: string;
  public area: number;
  public area_type: number;
  public area_built: number;
  public area_built_type: number;
  public lat: string;
  public lng: string;
  public createdAt: string;
  public expirationAt: string;
  public report_visits: number;
  public report_days: string;
  public report_date: string;
  public video_url: string;
  public delivery_date: string;
  public status: number;
  public images: PropertyImage[];
  public files: PropertyFile[];
  public features: PropertyFeatures[];

  constructor(
  ){
    this.features = [];
  }

}

export class PropertyImage {

  public id: number;
  public src: string;
  public src_thumb: string;
  public description: string;
  //noinspection TsLint
  constructor(
  ){}
}

export class PropertyFeatures {

  public id: number;
  public property_id: number;
  public property_type_feature_id: number;

  constructor() {}

}


export class PropertyFile {
  public id: number;
  public property_id: number;
  public file_name: string;
  public status: number;

  constructor() {}
}


export class PropertyContractHistory {

  public id: number;
  public office_id: number;
  public user_id: number;
  public property_id: number;
  public last_contract_id: number;
  public new_contract_id: number;
  public type: number;
  public comment: string;
  public price: number;
  public commission_percentage: number;
  public created_at: string;

  constructor() {}

}
