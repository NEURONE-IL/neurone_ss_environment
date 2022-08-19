import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simulation-modal-simnotfound',
  templateUrl: './simulation-modal-simnotfound.component.html',
  styleUrls: ['./simulation-modal-simnotfound.component.css']
})

// Modal to let the user know a simulation was not found when trying to access it
export class SimulationModalSimNotFoundComponent {

  public onSubmit = new EventEmitter();

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
