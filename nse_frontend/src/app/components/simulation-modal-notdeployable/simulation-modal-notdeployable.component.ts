import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-modal-notdeployable',
  templateUrl: './simulation-modal-notdeployable.component.html',
  styleUrls: ['./simulation-modal-notdeployable.component.css']
})

// Modal to let the user know that a simulation is not deployable, because its associated behavior model is not currently valid
export class SimulationModalNotDeployableComponent implements OnInit {

  public behaviorModelName: string = "";
  public onSubmit = new EventEmitter();
  
  // Constructor: Provides the input data needed for the modal
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  // ngOnInit: Retrieves the name of the behavior model to be displayed on the modal
  ngOnInit(): void {
    this.behaviorModelName = this.data.behaviorModelName;
  }

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}