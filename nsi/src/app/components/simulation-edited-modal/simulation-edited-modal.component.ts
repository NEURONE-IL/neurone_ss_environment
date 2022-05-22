import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulation-edited-modal',
  templateUrl: './simulation-edited-modal.component.html',
  styleUrls: ['./simulation-edited-modal.component.css']
})

export class SimulationEditedModalComponent implements OnInit {

  public onSubmit = new EventEmitter();
  
  ngOnInit() {
  }

  onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
