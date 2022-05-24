import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-not-deployable-modal',
  templateUrl: './simulation-not-deployable-modal.component.html',
  styleUrls: ['./simulation-not-deployable-modal.component.css']
})

export class SimulationNotDeployableModalComponent implements OnInit {

  public behaviorModelName: string = "";
  public onSubmit = new EventEmitter();
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.behaviorModelName = this.data.behaviorModelName;
  }

  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}