import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-behaviormodel-modal-added',
  templateUrl: './behaviormodel-modal-added.component.html',
  styleUrls: ['./behaviormodel-modal-added.component.css']
})

// Modal to let the user know that a behavior model has been created successfully
export class BehaviorModelModalAddedComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
