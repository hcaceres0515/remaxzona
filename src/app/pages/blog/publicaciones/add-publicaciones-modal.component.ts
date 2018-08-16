/**
 * Created by harold on 7/15/18.
 */



import {Component, EventEmitter, Output} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BlogService} from "../blog.service";
import {BlogPost} from "../blog-post";
import "../../../@theme/components/ckeditor/ckeditor.loader";
import 'ckeditor';
import {NbAuthService} from "../../../@theme/auth/services/auth.service";


@Component({
  selector: 'add-post-modal',
  template: `
    <div class="modal-header">
      <span>{{ modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">


      <form #blogPostAddForm="ngForm" novalidate>

        <div class="form-group">

          <label for="title">Titulo: *</label>
          <input type="text" class="form-control"  id="title" placeholder="Titulo del post" name="title" 
                 [(ngModel)]="blogPostData.title" required #title="ngModel" [disabled]="isView">

          <small class="form-text error"  *ngIf="title.errors && (title.dirty || title.touched)">
            * Titulo es requerido
          </small>

        </div>

        <div class="form-group">

          <label for="overview">Resumen: *</label>
          <input type="text" class="form-control"  id="overview" placeholder="Resumen del post" name="overview" 
                 [(ngModel)]="blogPostData.overview" required #overview="ngModel" [disabled]="isView">

          <small class="form-text error"  *ngIf="overview.errors && (overview.dirty || overview.touched)">
            * Resumen es requerido
          </small>

        </div>

        <div class="form-group">

          <label for="content">Descripción: *</label>

          <ckeditor [config]="{ extraPlugins: 'divarea', height: '150' }" name="content" 
                    [(ngModel)]="blogPostData.content" *ngIf="!isView"></ckeditor>

          <!--<ckeditor [(ngModel)]="blogPostData.content" [config]="config" name="content" id="content" required #content="ngModel"></ckeditor>-->
          
          <div *ngIf="isView" [innerHTML]="blogPostData.content">
          </div>

        </div>

        <div class="form-group row">
          <label class="col-sm-2" for="postCategory">Categoria: *</label>
          <div class="col-sm-4">
            <select class="form-control" id="postCategory" name="postCategory" 
                    [(ngModel)]="blogPostData.blog_category_id" [disabled]="isView">
              <option *ngFor="let item of blogCategories" [ngValue]="item.id">{{item.name}}</option>
            </select>
          </div>
        </div>  
        
        <div class="form-group" *ngIf="!isView">
          <input style="display: none" type="file" (change)="onImageFileSelected($event)" #fileInputImage>

          <button class="btn btn-info btn-tn" (click)="fileInputImage.click()"><i class="fa fa-image"></i> Seleccionar Imagen</button>
        </div>

        <div style="margin: 8px; display: inline-block; position: relative" *ngIf="!isView">
          <img  [src]="imageUrl" class="rounded mb-3" width="360" height="250">

          <!--<button class="btn btn-danger btn-tn del_photo" (click)="deletePropertyImage(i)"><i class="fa fa-trash"></i></button>-->
        </div>

        <div style="margin: 8px; display: inline-block; position: relative" *ngIf="isView">
          <img  [src]="blogPostData.img_src" class="rounded mb-3" width="360" height="250">

          <!--<button class="btn btn-danger btn-tn del_photo" (click)="deletePropertyImage(i)"><i class="fa fa-trash"></i></button>-->
        </div>

      </form>
    </div>

    <div class="modal-footer">
      <button *ngIf="!isView && !isEdit" class="btn btn-success btn-with-icon btn-tn"  [disabled]="!blogPostAddForm.form.valid" (click)="createBlogPost()"> <i class="fa fa-save"></i>  Guardar</button>
      <button *ngIf="isEdit" class="btn btn-success btn-with-icon btn-tn" [disabled]="!blogPostAddForm.form.valid" (click)="updateBlogPost()"> <i class="fa fa-save"></i>  Actualizar</button>
      <button class="btn btn-danger btn-with-icon btn-tn" (click)="closeModal()"> <i class="fa fa-times-circle"></i> Cancelar</button>
    </div>
  `
})

export class AddBlogPublicacionesComponent {

  modalHeader: string;
  isView: boolean = false;
  isEdit: boolean = false;

  blogPostData: BlogPost;
  blogCategories: any = [];

  imageUrl: string = 'assets/images/image-default.jpg';
  selectedImage: any;

  @Output() clickSave: EventEmitter<any> = new EventEmitter();
  @Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private activeModal: NgbActiveModal, private blogService: BlogService, private authService: NbAuthService){
    this.blogPostData = new BlogPost();
    this.getAllBlogCategories();
  }

  getAllBlogCategories() {
    this.blogService.getAllBlogCategories().subscribe(
      (response) => { this.blogCategories = response.data; },
      (error) => {},
      () => {
        // this.selectedPostCategory = this.blogPostCategories[0];
        // console.log(this.blogPostCategories);
      }
    );
  }

  createBlogPost() {

    this.blogPostData.user_id = this.authService.getUserId();
    this.blogPostData.office_id = this.authService.getOfficeId();

    let fd: FormData = new FormData();

    fd.append('image', this.selectedImage, this.selectedImage.name);
    fd.append('blog_post_data', JSON.stringify(this.blogPostData));

    this.blogService.createBlogPost(fd).subscribe(
      (response) => {},
      (error) => {},
      () => {
        this.activeModal.close();
        this.clickSave.emit();
      }
    );
  }

  updateBlogPost() {

    let fd: FormData = new FormData();

    if (this.selectedImage) {
      fd.append('image', this.selectedImage, this.selectedImage.name);
    }
    fd.append('blog_post_data', JSON.stringify(this.blogPostData));

    this.blogService.updateBlogPost(fd).subscribe(
      response => {},
      error => {},
      () => {
        this.closeModal();
        this.clickUpdate.emit();
      }
    );

  }

  loadNgModel(data) {

    this.blogPostData = data;

    if (this.isEdit){
      this.imageUrl = this.blogPostData.img_src;
    }

  }

  onImageFileSelected(event): void {
    let file = event.target.files[0];

    this.selectedImage = file;

    if (file) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }

      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
