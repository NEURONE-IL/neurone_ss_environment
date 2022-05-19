import { Component, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-behavior-model-deleted-modal',
  templateUrl: './behavior-model-deleted-modal.component.html',
  styleUrls: ['./behavior-model-deleted-modal.component.css']
})

export class BehaviorModelDeletedModalComponent implements OnInit {

  public behaviorModelName: string = "";
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.behaviorModelName = this.data.name;
  }

  public onOKButtonClicked = () => {
    this.onSubmit.emit();
  }


}
