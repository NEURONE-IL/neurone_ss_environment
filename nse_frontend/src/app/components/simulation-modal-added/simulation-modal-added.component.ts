import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simulation-modal-added',
  templateUrl: './simulation-modal-added.component.html',
  styleUrls: ['./simulation-modal-added.component.css']
})

// Modal to let the user know that a simulation has been created successfully
export class SimulationModalAddedComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
