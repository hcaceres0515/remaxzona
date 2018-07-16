/**
 * Created by harold on 7/11/18.
 */
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LocalDataSource, ViewCell} from "ng2-smart-table";
import {AddBlogPublicacionesComponent} from "./add-publicaciones-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BlogPost} from "../blog-post";
import {ROLES} from "../../../@core/config/rolesdb";
import {NotificationMessageService} from "../../../@theme/components/message-notification/notification.service";
import {BlogService} from "../blog.service";
import {ConfirmationModalComponent} from "../../../@theme/components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'actions-mis-publicaciones',
  template: `
    <div style="display: flex">
      <button class="btn btn-info btn-icon btn-tn"  title="Ver" (click)="showViewModal()"><i class="ion-eye"></i></button>
      <button class="btn btn-success btn-icon btn-tn"  title="Editar" (click)="showEditModal()"><i class="ion-edit"></i></button>
      <button class="btn btn-danger btn-icon btn-tn" title="Eliminar" (click)="showDeleteModal()"><i class="ion-trash-a"></i></button>
    </div>
  `,
})
export class ActionsBlogPublicacionesTable implements ViewCell, OnInit {

  ROLES = ROLES;
  sessionRolId: any;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() reloadBlogPostTable: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal, private notificationService: NotificationMessageService,
              private blogService: BlogService) {}

  ngOnInit() {

  }

  showEditModal() {
    const activeModal = this.modalService.open(AddBlogPublicacionesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

    activeModal.componentInstance.modalHeader = 'Editar Publicación';
    activeModal.componentInstance.isEdit = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

    activeModal.componentInstance.clickUpdate.subscribe(() => {
      this.updateBlogPost();
      this.notificationService.showToast('success', 'Confirmación', 'La publicación ha sido actualizada exitosamente');
    });

  }

  showViewModal() {

    const activeModal = this.modalService.open(AddBlogPublicacionesComponent, { size: 'lg', container: 'nb-layout'});

    activeModal.componentInstance.modalHeader = 'Ver Publicación';
    activeModal.componentInstance.isView = true;
    activeModal.componentInstance.loadNgModel(this.rowData);

  }

  showDeleteModal() {

    const activeModal = this.modalService.open(ConfirmationModalComponent, { size: 'sm', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = 'Confirmación';
    activeModal.componentInstance.modalBodyMessage = 'eliminar esta publicación';

    activeModal.componentInstance.clickConfirm.subscribe(
      () => {

        this.blogService.deleteBlogPost(this.rowData.id).subscribe(
          data => {},
          error => {},
          () => {

            this.updateBlogPost();
            this.notificationService.showToast('success', 'Confirmación', 'La publicación ha sido eliminada exitosamente');
          }
        )

      }
    );

  }

  updateBlogPost() {
    this.reloadBlogPostTable.emit();
  }
}


@Component({
  selector: 'ngx-blog-publicacion',
  templateUrl: './publicaciones.component.html'
})

export class BlogPublicacionComponent {

  source: LocalDataSource;

  public blogPostList: any = [];

  settings = {
    noDataMessage: 'No se encontraron registros.',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
      },
      title: {
        title: 'Título',
        type: 'string',
      },
      blog_category_name: {
        title: 'Categoría',
        type: 'string'
      },
      createdAt: {
        title: 'Creado',
        type: 'string',
      },
      actions: {
        title: 'Acciones',
        type: 'custom',
        filter: false,
        renderComponent: ActionsBlogPublicacionesTable,
        onComponentInitFunction: (instance) => {
          instance.reloadBlogPostTable.subscribe(row => {
            // this.showEditModal();
            this.loadTable();
          });
        }
      }
    },

  }

  constructor(private modalService: NgbModal, private notificationService: NotificationMessageService,
              private blogService: BlogService){

    this.source = new LocalDataSource();
    this.loadTable();

  }

  loadTable() {
    this.blogService.getAllBlogPosts().subscribe(
      (response) => { this.blogPostList = response.data; },
      (error) => {},
      () => {
        this.source.load(this.blogPostList);
      }
    );
  }

  showAddPostModal() {

    const activeModal = this.modalService.open(AddBlogPublicacionesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static'});

    activeModal.componentInstance.modalHeader = 'Agregar Publicaciön';

    activeModal.componentInstance.clickSave.subscribe(() => {
      this.loadTable();
      this.notificationService.showToast('success', 'Confirmación', 'La publicación ha sido creada exitosamente');
    });

  }

}
