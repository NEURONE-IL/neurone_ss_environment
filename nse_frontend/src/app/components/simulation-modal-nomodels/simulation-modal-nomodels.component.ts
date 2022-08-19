import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-modal-nomodels',
  templateUrl: './simulation-modal-nomodels.component.html',
  styleUrls: ['./simulation-modal-nomodels.component.css']
})

// Modal to let the user know that a simulation cannot be created until a behavior model has been created
export class SimulationModalNoModelsComponent implements OnInit {

  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  ngOnInit(): void {
  }

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
