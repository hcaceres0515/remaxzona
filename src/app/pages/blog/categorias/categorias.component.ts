/**
 * Created by harold on 7/11/18.
 */
import {Component, ViewEncapsulation} from "@angular/core";
import {LocalDataSource} from "ng2-smart-table";
import {BlogService} from "../blog.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'ngx-blog-categoria',
  templateUrl: './categorias.component.html',
  styles: [
    `
      :host /deep/ a.ng2-smart-action.ng2-smart-action-add-add {
        font-size: 15px!important;
        width: 170px;
      }

      :host /deep/ a.ng2-smart-action.ng2-smart-action-add-create {
        font-size: 15px !important;
        width: 170px;
      }
      
    `
  ]
})

export class BlogCategoriaComponent {

  source: LocalDataSource;

  public blogCategories: any =  [];
  public selectedCategory: any = [];

  settings = {
    noDataMessage: 'No se encontraron registros.',
    attr: {
      class: 'custom'
    },
    actions: {
      position: 'right',
      columnTitle: 'Acciones',
      add: true,
      edit: true,
      delete: true
    },
    add: {
      addButtonContent: '<i class="ion-plus-round"></i> Agregar Categoria',
      createButtonContent: '<i class="ion-checkmark-round"></i> Guardar',
      cancelButtonContent: '<i class="ion-close"></i> Cancelar',
      confirmCreate: true,
      inputClass: 'form-control'
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: 'Guardar',
      cancelButtonContent: 'Cancelar',
      confirmSave: true
    },
    columns: {
      id: {
        title: 'ID',
        editable: false,
        addable: false,
      },
      name: {
        title: 'Nombre',
      }
    },
  };

  constructor(private blogService: BlogService, private modalService: NgbModal,
              private notificationService: NotificationMessageService) {
    this.source = new LocalDataSource();
    this.getCategories();
  }

  getCategories() {
    this.blogService.getAllBlogCategories().subscribe(
      (response) => { this.blogCategories = response.data; },
      (error) => {},
      () => {
        this.source.load(this.blogCategories);
      }
    )
  }

  createBlogCategory(event): void {

    if (event.newData.name !== '') {
      event.confirm.resolve();
      this.blogService.createBlogCategory(event.newData.name).subscribe(
        () => {},
        (error) => {},
        () => {
          this.getCategories();
        }
      );
    }

  }

  updateCategory(event): void {

    if (event.newData.name !== '') {
      event.confirm.resolve();
      this.blogService.updateBlogCategory(event.newData.id, event.newData.name).subscribe(
        (error) => {},
        () => {
          this.getCategories();
        }
      );
    }
  }

  onDeleteConfirm(event): void {

    this.selectedCategory = event.data;

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'eliminar esta categoria';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        this.blogService.deleteBlogCategory(event.data.id).subscribe(
          data => {},
          error => {},
          () => {

            this.getCategories();
            this.notificationService.showToast('success', 'Confirmación', 'La categoria ha sido eliminada exitosamente');
          }
        )

      }
    );

  }

}
