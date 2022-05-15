import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-deleted-modal',
  templateUrl: './simulation-deleted-modal.component.html',
  styleUrls: ['./simulation-deleted-modal.component.css']
})

export class SimulationDeletedModalComponent implements OnInit {

  public simulationName: string = "";
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.simulationName = this.data.name;
  }

  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
