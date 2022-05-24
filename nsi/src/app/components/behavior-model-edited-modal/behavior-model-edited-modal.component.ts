import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-behavior-model-edited-modal',
  templateUrl: './behavior-model-edited-modal.component.html',
  styleUrls: ['./behavior-model-edited-modal.component.css']
})
export class BehaviorModelEditedModalComponent implements OnInit {

  public onSubmit = new EventEmitter();
  
  ngOnInit() {
  }

  onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
