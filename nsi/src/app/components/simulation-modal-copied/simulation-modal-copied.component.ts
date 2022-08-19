import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-modal-copied',
  templateUrl: './simulation-modal-copied.component.html',
  styleUrls: ['./simulation-modal-copied.component.css']
})

// Modal to let the user know that a simulation has been copied successfully
export class SimulationModalCopiedComponent implements OnInit {

  public simulationName: string = "";
  public onSubmit = new EventEmitter();

  // Constructor: Provides the input data needed for the modal
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  // ngOnInit: Retrieves the name of the simulation to be displayed on the modal
  ngOnInit(): void {
    this.simulationName = this.data.name;
  }

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
