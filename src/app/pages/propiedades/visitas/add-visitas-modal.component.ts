

@Component({
	selector: 'add-visitas-modal',
	template: ``
})

export class AddVisitasModalComponent {

	modalHeader: string,
	isView: boolean = false;
	isEdit: boolean = false;

  	@Output() clickSave: EventEmitter<any> = new EventEmitter();
  	@Output() clickUpdate: EventEmitter<any> = new EventEmitter();

  	constructor(private activeModal: NgbActiveModal){}

	closeModal() {
    	this.activeModal.close();
  	}
}