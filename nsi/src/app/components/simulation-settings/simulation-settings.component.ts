import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';

import { SimulationModalConfirmDeleteComponent } from '../simulation-modal-confirmdelete/simulation-modal-confirmdelete.component';
import { SimulationModalDeletedComponent } from '../simulation-modal-deleted/simulation-modal-deleted.component';
import { SimulationModalNotDeployableComponent} from '../simulation-modal-notdeployable/simulation-modal-notdeployable.component';

import { SimulationDeployActiveService } from '../../services/simulationDeployActive.service';
import { CatchNotFoundErrorService } from '../../services/catchNotFoundError.service';

@Component({
  selector: 'app-simulation-settings',
  templateUrl: './simulation-settings.component.html',
  styleUrls: ['./simulation-settings.component.css']
})

// Simulation settings component, which displays information about the simulation, and allows the user to access the simulation edit and simulation deploy components, as well as delete the simulation
export class SimulationSettingsComponent implements OnInit {

  public _id: string = '';
  public simulationName: string = '';
  public simulationDescription: string = '';
  public simulationBehaviorModelId: string = '';
  public simulationBehaviorModelName: string = '';
  public simulationBehaviorModelValid: boolean = false;
  public simulationBehaviorModelValidString: string = '';
  public simulationCreationDate: string = '';
  public simulationLastDeployDate: string = '';
  public simulationLastModificationDate: string = '';
  private validBehaviorModelText = $localize`:Text of the form of the New Simulation component:valid`;
  private invalidBehaviorModelText = $localize`:Text of the form of the New Simulation component:invalid`;
  private neverDeployedText = $localize`:Text to describe a simulation that has never been deployed:Never`;
  private dayjsFormat = $localize`:Date format for Dayjs library:YYYY/MM/DD HH:mm:ss`;

  // Constructor: Injects dependencies, and redirects the user to the home page if no simulation ID has been provided
  constructor(private router: Router,
              private _simulationService: SimulationService,
              private _behaviorModelService: BehaviorModelService,
              private _matDialog: MatDialog,
              private _simulationDeployActiveService: SimulationDeployActiveService,
              private _catchNotFoundErrorService: CatchNotFoundErrorService) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
    } else {
      this.router.navigate(['/', 'home']);
    }
  }

  // ngOnInit: Retrieves the simulation data that will be displayed on the component
  async ngOnInit() {
    try {
      let simulation = await this._simulationService.getSimulation(this._id).toPromise();

      this.simulationName = simulation!.name;

      this.simulationDescription = simulation!.description;
      this.simulationBehaviorModelId = simulation!.behaviorModelId;
      let behaviorModel = await this._behaviorModelService.getBehaviorModel(this.simulationBehaviorModelId).toPromise();
      this.simulationBehaviorModelName = behaviorModel.name;

      this.simulationBehaviorModelValid = behaviorModel.valid;
      if (this.simulationBehaviorModelValid == true) {
        this.simulationBehaviorModelValidString = this.validBehaviorModelText;
      } else {
        this.simulationBehaviorModelValidString = this.invalidBehaviorModelText;
      }

      this.simulationCreationDate = dayjs(simulation!.creationDate).format(this.dayjsFormat);
      this.simulationLastModificationDate = dayjs(simulation!.lastModificationDate).format(this.dayjsFormat);

      let simulationLastDeployDateTime = new Date(simulation!.lastDeployDate).getTime();
      if (simulationLastDeployDateTime != 0) {
        this.simulationLastDeployDate = dayjs(simulation!.lastDeployDate).format(this.dayjsFormat);
      } else {
        this.simulationLastDeployDate = this.neverDeployedText;
      }
      this._simulationDeployActiveService.setDeployInactive();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
      return;
    }
  }

  // Navigates to the simulation edit component
  public configureSimulation = async () => {
    try {
      let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
      return;
    }

    this.router.navigate(['/', 'simulation-edit'], { state:
      { _id: this._id,
        startEdit: true
    }});
  }

  // Opens the modal that asks the user to confirm he wants to delete a simulation
  public openDeleteConfirmModal = () => {
    let _id = this._id;
    let name = this.simulationName;

    const dialogRef = this._matDialog.open(SimulationModalConfirmDeleteComponent, { width: '30%' , data: { name: name }, disableClose: true } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
        this._simulationService.deleteSimulation(_id).subscribe(() => {
        this.openDeleteNotificationModal(name);
      }, (error: any) => {
        console.log(error);
      })
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Opens the modal that lets the user know that a simulation has been deleted
  private openDeleteNotificationModal = (name: string) => {
    const dialogRef = this._matDialog.open(SimulationModalDeletedComponent, { width: '30%' , data: { name: name }, disableClose: true } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.router.navigate(['/', 'home']);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Navigates to the simulation deploy component
  public deploySimulation = async () => {
    try {
      let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
      return;
    }

    if (this.simulationBehaviorModelValid == false) {
      const dialogRef = this._matDialog.open(SimulationModalNotDeployableComponent, { width: '45%', data: { behaviorModelName: this.simulationBehaviorModelName }, disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.router.navigate(['/', 'simulation-deploy'], { state:
        { _id: this._id
       }});
    }
  }

}
