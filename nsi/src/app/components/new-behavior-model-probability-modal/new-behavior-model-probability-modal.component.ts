import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-behavior-model-probability-modal',
  templateUrl: './new-behavior-model-probability-modal.component.html',
  styleUrls: ['./new-behavior-model-probability-modal.component.css']
})
export class NewBehaviorModelProbabilityModalComponent {

  public currentProbability: string = "";
  onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit() {
    if (this.data.currentProbability != "(no value)") {
      this.currentProbability = this.data.currentProbability.slice(0, -1);
    }
  }

  onOKButtonClicked() {
    this.onSubmit.emit(this.currentProbability);
  }
  
}
