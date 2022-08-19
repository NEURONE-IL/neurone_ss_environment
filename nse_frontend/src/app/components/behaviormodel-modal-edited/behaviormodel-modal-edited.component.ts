import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-behaviormodel-modal-edited',
  templateUrl: './behaviormodel-modal-edited.component.html',
  styleUrls: ['./behaviormodel-modal-edited.component.css']
})

// Modal to let the user know a behavior model was successfully edited
export class BehaviorModelModalEditedComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
