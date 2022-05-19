import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behavior-model-delete-confirm-modal',
  templateUrl: './behavior-model-delete-confirm-modal.component.html',
  styleUrls: ['./behavior-model-delete-confirm-modal.component.css']
})

export class BehaviorModelDeleteConfirmModalComponent implements OnInit {

  public behaviorModelName: string = "";
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.behaviorModelName = this.data.name;
  }

  public onYesButtonClicked = () => {
    this.onSubmit.emit();
  }

}
