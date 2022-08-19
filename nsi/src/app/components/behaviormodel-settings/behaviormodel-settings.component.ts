import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as dayjs from 'dayjs';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModelModalConfirmDeleteComponent } from '../behaviormodel-modal-confirmdelete/behaviormodel-modal-confirmdelete.component';
import { BehaviorModelModalDeletedComponent } from '../behaviormodel-modal-deleted/behaviormodel-modal-deleted.component';
import { BehaviorModelModalInUseComponent} from '../behaviormodel-modal-inuse/behaviormodel-modal-inuse.component';

import { CatchNotFoundErrorService } from '../../services/catchNotFoundError.service';

@Component({
  selector: 'app-behaviormodel-settings',
  templateUrl: './behaviormodel-settings.component.html',
  styleUrls: ['./behaviormodel-settings.component.css']
})

// Behavior model settings component, which displays information about the behavior model, and allows the user to access the behavior model edit component, as well as delete the behavior model
export class BehaviorModelSettingsComponent implements OnInit {

  public _id: string = '';
  public behaviorModelName: string = '';
  public behaviorModelValid: boolean = false;
  public behaviorModelCreationDate: string = '';
  public behaviorModelLastModificationDate: string = '';
  private dayjsFormat = $localize`:Date format for Dayjs library:YYYY/MM/DD HH:mm:ss`;

  // Constructor: Injects dependencies, and redirects the user to the home page if no behavior model ID has been provided
  constructor(private router: Router,
              private _behaviorModelService: BehaviorModelService,
              private _matDialog: MatDialog,
              private _simulationService: SimulationService,
              private _catchNotFoundErrorService: CatchNotFoundErrorService) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
    } else {
      this.router.navigate(['/', 'home']);
    }

  }

  // ngOnInit: Retrieves the behavior model data that will be displayed on the component
  async ngOnInit() {
    try {
      let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();

      this.behaviorModelName = behaviorModel.name;
      this.behaviorModelValid = behaviorModel.valid;
      this.behaviorModelCreationDate = dayjs(behaviorModel.creationDate).format(this.dayjsFormat);
      this.behaviorModelLastModificationDate = dayjs(behaviorModel.lastModificationDate).format(this.dayjsFormat);
    } catch (error) {
      this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
      return;
    }
  }

  // Navigates to the behavior model editor component
  public configureBehaviorModel = async () => {
    try {
      let behaviorModel = await this._behaviorModelService.getBehaviorModel(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchBehaviorModelNotFoundError(error);
      return;
    }

    this.router.navigate(['/', 'behaviormodel-edit'], { state:
      { _id: this._id
     }});
  }

  // Opens the modal that asks the user to confirm he wants to delete a behavior model, or the modal that tells the user that said behavior model cannot be deleted
  public openDeleteConfirmModal = async () => {
    let _id = this._id;
    let name = this.behaviorModelName;
    let modelIsInUse = false;
    let simulationNamesUsingModels: string[] = [];
    let simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();

    for (let i = 0; i < simulationBehaviorModels.length; i++) {
      if (simulationBehaviorModels[i].simulationBehaviorModelId === _id) {
        modelIsInUse = true;
        simulationNamesUsingModels.push(simulationBehaviorModels[i].simulationName);
      }
    }

    if (modelIsInUse == true) {

      const dialogRef = this._matDialog.open(BehaviorModelModalInUseComponent, { width: '45%' , data: { name: name, simulationNamesUsingModels: simulationNamesUsingModels }, disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(async () => {
        dialogRef.close();
        simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });

    } else {

      const dialogRef = this._matDialog.open(BehaviorModelModalConfirmDeleteComponent, { width: '30%' , data: { name: name }, disableClose: true } );

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
  }

  // Opens the modal that lets the user know that a behavior model has been deleted
  private openDeleteNotificationModal = (name: string) => {
    const dialogRef = this._matDialog.open(BehaviorModelModalDeletedComponent, { width: '30%' , data: { name: name } } );

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

  // Navigates to the home page
  public goToBehaviorModelListHome = () => {
    this.router.navigate(['/', 'home'], { state: {
      goToBehaviorModelsTab: true
    }});
  }

}
