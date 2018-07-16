import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PropertyService} from "./propiedades.service";
import {Property} from "./property";
import {PATHS} from "../../@core/config/constanst";
import { DomSanitizer } from '@angular/platform-browser';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";
import {NbAuthService} from "../../@theme/auth/services/auth.service";

@Component({
  selector: 'view-property-modal',
  styleUrls: ['./subir-propiedad/subir-propiedad.scss'],
  templateUrl: './view-property-modal.component.html'
})

export class ViewPropertyModalComponent implements  OnInit{

  modalHeader: string;

  public latitude: number;
  public longitude: number;
  public zoom: number = 12;
  public icon = PATHS.MAP_ICON;

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  propertyData: any = [];
  propertyId;
  videoUrl: any;

  userId: any;

  constructor(private activeModal: NgbActiveModal, private propertyService: PropertyService,
              private sanitizer: DomSanitizer, private authService: NbAuthService) {}

  ngOnInit(): void {

    this.userId = this.authService.getUserId();

    this.galleryOptions = [
      {
        width: '727px',
        height: '411px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.propertyService.getPropertyDetail(this.propertyId).subscribe(
      response => {
        this.propertyData = response.data;
      },
      error => {},
      () => {
        this.modalHeader = this.modalHeader + " - Codigo " + this.propertyId;
        this.setFormatImages();
        let video: string;
        this.latitude = +this.propertyData.lat;
        this.longitude = +this.propertyData.lng;
        video = this.propertyData.video_url + '';
        this.propertyData.video_url = this.propertyData.video_url + '';

        if (video.includes('watch')) {
          video = video.replace("watch?v=", "embed/");
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(video);
        }

      }
    );
  }


  setFormatImages() {

    let image: any = {};

    this.galleryImages = [];

    (this.propertyData.images).forEach((item) => {
      image = {
        small: item.src_thumb,
        medium: item.src,
        big: item.src
      };
      this.galleryImages.push(image);
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
