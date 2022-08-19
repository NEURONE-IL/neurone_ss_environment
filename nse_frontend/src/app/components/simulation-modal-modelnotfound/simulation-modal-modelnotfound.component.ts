import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simulation-modal-modelnotfound',
  templateUrl: './simulation-modal-modelnotfound.component.html',
  styleUrls: ['./simulation-modal-modelnotfound.component.css']
})

// Modal to let the user know a selected behavior model for the simulation was not found when trying to access it
export class SimulationModalModelNotFoundComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
