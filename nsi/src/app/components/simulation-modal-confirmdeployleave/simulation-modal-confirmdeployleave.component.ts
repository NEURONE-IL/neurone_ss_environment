import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-modal-confirmdeployleave',
  templateUrl: './simulation-modal-confirmdeployleave.component.html',
  styleUrls: ['./simulation-modal-confirmdeployleave.component.css']
})

// Modal to ask the user to confirm he wants to leave the simulation deploy component, because doing so will cause the deployed simulation to be stopped
export class SimulationModalConfirmDeployLeaveComponent implements OnInit {

  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  ngOnInit(): void {
  }

  // Event triggered when the user presses the yes button on the modal
  public onYesButtonClicked = () => {
    this.onSubmit.emit();
  }

}