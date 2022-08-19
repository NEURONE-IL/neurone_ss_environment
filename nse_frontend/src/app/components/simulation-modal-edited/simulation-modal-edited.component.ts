import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simulation-modal-edited',
  templateUrl: './simulation-modal-edited.component.html',
  styleUrls: ['./simulation-modal-edited.component.css']
})

// Modal to let the user know that a simulation has been edited successfully
export class SimulationModalEditedComponent {

  public onSubmit = new EventEmitter();
  
  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
