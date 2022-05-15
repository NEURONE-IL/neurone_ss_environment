import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-delete-confirm-modal',
  templateUrl: './simulation-delete-confirm-modal.component.html',
  styleUrls: ['./simulation-delete-confirm-modal.component.css']
})

export class SimulationDeleteConfirmModalComponent implements OnInit {

  public simulationName: string = "";
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.simulationName = this.data.name;
  }

  public onYesButtonClicked = () => {
    this.onSubmit.emit();
  }

}
