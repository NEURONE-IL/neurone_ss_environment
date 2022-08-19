import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})

// Modal that presents a generic error message to the user
export class ModalErrorComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }
}
