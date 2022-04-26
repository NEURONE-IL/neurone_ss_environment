import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-model-probability-modal',
  templateUrl: './new-model-probability-modal.component.html',
  styleUrls: ['./new-model-probability-modal.component.css']
})
export class NewModelProbabilityModalComponent {

  onSubmit = new EventEmitter();

  constructor() {
  }
  
  onOKButtonClicked(probability: any) {
    this.onSubmit.emit(probability.value);
  }
  
}
