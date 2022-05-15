import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simulation-copied-modal',
  templateUrl: './simulation-copied-modal.component.html',
  styleUrls: ['./simulation-copied-modal.component.css']
})

export class SimulationCopiedModalComponent implements OnInit {

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
