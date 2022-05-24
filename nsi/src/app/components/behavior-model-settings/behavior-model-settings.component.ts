import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as dayjs from 'dayjs';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { BehaviorModelDeleteConfirmModalComponent } from '../behavior-model-delete-confirm-modal/behavior-model-delete-confirm-modal.component';
import { BehaviorModelDeletedModalComponent } from '../behavior-model-deleted-modal/behavior-model-deleted-modal.component';

@Component({
  selector: 'app-behavior-model-settings',
  templateUrl: './behavior-model-settings.component.html',
  styleUrls: ['./behavior-model-settings.component.css']
})

export class BehaviorModelSettingsComponent implements OnInit {

  public _id: string = '';
  public behaviorModelName: string = '';
  public behaviorModelValid: string = '';
  public behaviorModelCreationDate: string = '';
  public behaviorModelLastModificationDate: string = '';

  constructor(private router: Router,
              private _behaviorModelService: BehaviorModelService,
              private _matDialog: MatDialog) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
    } else {
      this.router.navigate(['/', 'home']);
    }

  }

  async ngOnInit() {
    let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();

    this.behaviorModelName = behaviorModel.name;
    this.behaviorModelValid = behaviorModel.valid;
    this.behaviorModelCreationDate = dayjs(behaviorModel.creationDate).format('YYYY/MM/DD HH:mm:ss');
    this.behaviorModelLastModificationDate = dayjs(behaviorModel.lastModificationDate).format('YYYY/MM/DD HH:mm:ss');
  }

  public configureBehaviorModel = () => {
    this.router.navigate(['/', 'edit-behavior-model'], { state:
      { _id: this._id
     }});
  }

  public openDeleteConfirmModal = () => {

    let _id = this._id;
    let name = this.behaviorModelName;

    const dialogRef = this._matDialog.open(BehaviorModelDeleteConfirmModalComponent, { width: '30%' , data: { name: name } } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
        this._behaviorModelService.deleteBehaviorModel(_id).subscribe(() => {
        this.openDeleteNotificationModal(name);
      }, (error: any) => {
        console.log(error);
      })
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  private openDeleteNotificationModal = (name: string) => {

    const dialogRef = this._matDialog.open(BehaviorModelDeletedModalComponent, { width: '30%' , data: { name: name } } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.router.navigate(['/', 'home'], { state: {
        goToBehaviorModelsTab: true
      }});
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  public goToBehaviorModelListHome = () => {
    this.router.navigate(['/', 'home'], { state: {
      goToBehaviorModelsTab: true
    }});
  }

}
