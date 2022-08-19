import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-modal-confirmdelete',
  templateUrl: './simulation-modal-confirmdelete.component.html',
  styleUrls: ['./simulation-modal-confirmdelete.component.css']
})

// Modal in which the user must confirm he wants to delete a simulation
export class SimulationModalConfirmDeleteComponent implements OnInit {

  public simulationName: string = "";
  public onSubmit = new EventEmitter();

  // Constructor: Provides the input data needed for the modal
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  // ngOnInit: Retrieves the name of the simulation to be displayed on the modal
  ngOnInit(): void {
    this.simulationName = this.data.name;
  }

  // Event triggered when the user presses the yes button on the modal
  public onYesButtonClicked = () => {
    this.onSubmit.emit();
  }

}
