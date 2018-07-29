/**
 * Created by harold on 7/26/18.
 */

import {Component} from "@angular/core";
import {SliderService} from "./slider.service";
import {SampleLayoutService} from "../../../@theme/layouts/sample/sample.layout.service";

@Component({
  selector: 'ngx-slider',
  templateUrl: './slider.component.html'
})

export class SliderComponent {

  public sliderData: any = [];
  public sliderSelected: any = {id: null, property_id: null, title: '', message: '', img_src: '', button_link: '', priority: 0, status: 1};

  public selectedImage: any;
  public imageUrl: string = 'assets/images/image-default.jpg';

  public sizeImageValid: boolean = true;

  public isProperty: boolean = false;
  public showEditSliderBox: boolean = false;

  constructor(private sliderService: SliderService, private sampleLayoutService: SampleLayoutService){

  }

  ngOnInit() {

    this.getSliderMain();
  }

  getSliderMain() {

    this.sliderService.getSliderMain().subscribe(
      (response) => { this.sliderData = response.data; },
      (error) => {},
      () => {
      }
    );

  }

  selectEditSlider(data) {

    this.sliderSelected = JSON.parse(JSON.stringify(data));
    this.imageUrl = (this.sliderSelected.img_src != '') ? this.sliderSelected.img_src : this.imageUrl;
    this.showEditSliderBox = true;

    if (this.sliderSelected.property_id == null) {
      this.isProperty = false;
    } else {
      this.isProperty = true;
    }
  }

  onImageFileSelected(event): void {

    let reader = new FileReader();
    let image = new Image();

    let file = event.target.files[0];

    this.selectedImage = file;

    if (file) {

      reader.onload = (event: any) => {

        image.src = event.target.result;

        this.imageUrl = event.target.result;

        image.onload = () => {
         // console.log(image.width, image.height);

         if (image.width < 1900 || image.height < 830){
           this.sizeImageValid = false;
         }
        }
      }
      reader.readAsDataURL(file);
    }
  }

  editSlider() {
    if (this.isProperty) {
      this.sliderSelected.title = '';
      this.sliderSelected.message = '';
      this.sliderSelected.button_link = '';
    } else {
      this.sliderSelected.property_id = null;
    }

    this.sampleLayoutService.onSetLoadingIcon.emit(true);

    let fd: FormData = new FormData();

    fd.append('file', this.selectedImage, this.selectedImage.name);
    fd.append('slider_data', JSON.stringify(this.sliderSelected));

    this.sliderService.editSliderMain(fd).subscribe(
      (response) => {},
      (error) => {},
      () => {
        this.sampleLayoutService.onSetLoadingIcon.emit(false);
        this.close();
        this.getSliderMain();
      }
    );
  }

  close() {
    this.sizeImageValid = true;
    this.showEditSliderBox = false;
  }

}
