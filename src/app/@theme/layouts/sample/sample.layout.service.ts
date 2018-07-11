import {EventEmitter, Injectable} from "@angular/core";
@Injectable()

export class SampleLayoutService {

  onSetLoadingIcon: EventEmitter<any> = new EventEmitter();

}
