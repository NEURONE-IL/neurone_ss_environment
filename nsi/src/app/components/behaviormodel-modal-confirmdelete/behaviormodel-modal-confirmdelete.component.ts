import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behaviormodel-modal-confirmdelete',
  templateUrl: './behaviormodel-modal-confirmdelete.component.html',
  styleUrls: ['./behaviormodel-modal-confirmdelete.component.css']
})

// Modal in which the user must confirm he wants to delete a behavior model
export class BehaviorModelModalConfirmDeleteComponent implements OnInit {

  public behaviorModelName: string = "";
  public onSubmit = new EventEmitter();

  // Constructor: Provides the input data needed for the modal
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any) {
  }

  // ngOnInit: Retrieves the behavior model name to be displayed on the modal
  ngOnInit(): void {
    this.behaviorModelName = this.data.name;
  }

  // Event triggered when the user presses the yes button on the modal
  public onYesButtonClicked = () => {
    this.onSubmit.emit();
  }

}
