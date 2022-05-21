import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-no-valid-models-modal',
  templateUrl: './simulation-no-valid-models-modal.component.html',
  styleUrls: ['./simulation-no-valid-models-modal.component.css']
})
export class SimulationNoValidModelsModalComponent implements OnInit {

  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
