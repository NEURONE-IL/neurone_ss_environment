import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulation-added-modal',
  templateUrl: './simulation-added-modal.component.html',
  styleUrls: ['./simulation-added-modal.component.css']
})

export class SimulationAddedModalComponent implements OnInit {

  public onSubmit = new EventEmitter();
  
  ngOnInit() {
  }

  onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
