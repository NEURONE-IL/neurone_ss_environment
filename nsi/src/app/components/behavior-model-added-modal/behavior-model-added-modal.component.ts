import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-behavior-model-added-modal',
  templateUrl: './behavior-model-added-modal.component.html',
  styleUrls: ['./behavior-model-added-modal.component.css']
})
export class BehaviorModelAddedModalComponent implements OnInit {

  public onSubmit = new EventEmitter();
  
  ngOnInit() {
  }

  onOKButtonClicked = () => {
    this.onSubmit.emit();
  }

}
