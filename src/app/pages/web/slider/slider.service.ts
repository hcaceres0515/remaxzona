import {HttpClient} from "@angular/common/http";
import {PATHS} from "../../../@core/config/constanst";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ServerResponse} from "../../../@core/utils/ServerResponse";

@Injectable()
export class SliderService {

  constructor(private http: HttpClient) {

  }

  getSliderMain(): Observable<ServerResponse> {
    return this.http.get(PATHS.API + '&c=theme&m=get_all_slider_main');
  }

  editSliderMain(data): Observable<ServerResponse> {
    return this.http.post(PATHS.API + '&c=theme&m=edit_slider_main', data);
  }

}
