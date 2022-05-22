import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behavior-model-in-use-modal',
  templateUrl: './behavior-model-in-use-modal.component.html',
  styleUrls: ['./behavior-model-in-use-modal.component.css']
})

export class BehaviorModelInUseModalComponent implements OnInit {

  public behaviorModelName: string = "";
  public simulationNamesUsingModels: string[] = []
  public onSubmit = new EventEmitter();
  public showPartial = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

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

  onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
