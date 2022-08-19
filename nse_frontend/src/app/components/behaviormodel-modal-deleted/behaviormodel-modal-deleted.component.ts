import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behaviormodel-modal-deleted',
  templateUrl: './behaviormodel-modal-deleted.component.html',
  styleUrls: ['./behaviormodel-modal-deleted.component.css']
})

// Modal to let the user know a behavior model was successfully deleted
export class BehaviorModelModalDeletedComponent implements OnInit {

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

  // Event triggered when the user presses the OK button on the modal
  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
