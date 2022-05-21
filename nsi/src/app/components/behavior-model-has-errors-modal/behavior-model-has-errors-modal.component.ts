import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behavior-model-has-errors-modal',
  templateUrl: './behavior-model-has-errors-modal.component.html',
  styleUrls: ['./behavior-model-has-errors-modal.component.css']
})

export class BehaviorModelHasErrorsModalComponent implements OnInit {

  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  public onYesButtonClicked = () => {
    this.onSubmit.emit(true);
  }

  public onNoButtonClicked = () => {
    this.onSubmit.emit(false);
  }

}
