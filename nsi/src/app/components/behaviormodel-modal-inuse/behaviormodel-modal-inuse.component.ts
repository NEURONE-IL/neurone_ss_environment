import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behaviormodel-modal-inuse',
  templateUrl: './behaviormodel-modal-inuse.component.html',
  styleUrls: ['./behaviormodel-modal-inuse.component.css']
})

// Modal to let the user know that a behavior model cannot be deleted, because it's currently set as the model to be used by one or more existing simulations
export class BehaviorModelModalInUseComponent implements OnInit {

  public behaviorModelName: string = "";
  public simulationNamesUsingModels: string[] = []
  public onSubmit = new EventEmitter();
  public showPartial = false;
  
  // Constructor: Provides the input data needed for the modal
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  // ngOnInit: Retrieves the behavior model name to be displayed on the modal, and the list of simulations that have that behavior model assigned to them
  ngOnInit() {
    this.behaviorModelName = this.data.name;
    let simulationNameCount = 0;
    while (simulationNameCount <= 2) {
      this.simulationNamesUsingModels.push(this.data.simulationNamesUsingModels[simulationNameCount])
      simulationNameCount = simulationNameCount + 1;
    }

    if (this.data.simulationNamesUsingModels.length > 3) {
      this.showPartial = true;
    }
  }

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
