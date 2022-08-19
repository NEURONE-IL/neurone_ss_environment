import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-behaviormodel-modal-notfound',
  templateUrl: './behaviormodel-modal-notfound.component.html',
  styleUrls: ['./behaviormodel-modal-notfound.component.css']
})

// Modal to let the user know a behavior model was not found when trying to access it
export class BehaviorModelModalNotFoundComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
