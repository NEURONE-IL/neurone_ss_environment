import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behaviormodel-modal-haserrors',
  templateUrl: './behaviormodel-modal-haserrors.component.html',
  styleUrls: ['./behaviormodel-modal-haserrors.component.css']
})

// Modal to let the user know that a behavior model has errors (making undeployable any simulation it is assigned to) and ask him if he still wants to save the invalid model
export class BehaviorModelModalHasErrorsComponent implements OnInit {

  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {}

  ngOnInit(): void {
  }

  // Event triggered when the user presses the yes button on the modal
  public onYesButtonClicked = () => {
    this.onSubmit.emit(true);
  }

  // Event triggered when the user presses the no button on the modal
  public onNoButtonClicked = () => {
    this.onSubmit.emit(false);
  }

}
