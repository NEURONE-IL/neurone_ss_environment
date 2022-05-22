import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { SimulationDeleteConfirmModalComponent } from '../simulation-delete-confirm-modal/simulation-delete-confirm-modal.component';
import { SimulationDeletedModalComponent } from '../simulation-deleted-modal/simulation-deleted-modal.component';

@Component({
  selector: 'app-simulation-settings',
  templateUrl: './simulation-settings.component.html',
  styleUrls: ['./simulation-settings.component.css']
})

export class SimulationSettingsComponent implements OnInit {

  public _id: string = '';
  public simulationName: string = '';
  public simulationDescription: string = '';
  public simulationCreationDate: string = '';
  public simulationLastDeployDate: string = '';

  constructor(private router: Router,
              private _simulationService: SimulationService,
              private _matDialog: MatDialog) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
    } else {
      this.router.navigate(['/', 'home']);
    }

  }

  async ngOnInit() {
    let simulation = await this._simulationService.getSimulation(this._id).toPromise();

    this.simulationName = simulation.name;

    this.simulationDescription = simulation.description;

    this.simulationCreationDate = dayjs(simulation.creationDate).format('YYYY/MM/DD HH:mm:ss');

    let simulationLastDeployDateTime = new Date(simulation.lastDeployDate).getTime();
    if (simulationLastDeployDateTime != 0) {
      this.simulationLastDeployDate = dayjs(simulation.lastDeployDate).format('YYYY/MM/DD HH:mm:ss');
    } else {
      this.simulationLastDeployDate = "Never";
    }
  }

  public configureSimulation = () => {
    this.router.navigate(['/', 'edit-simulation'], { state:
      { _id: this._id,
        startEdit: true
     }});
  }

  public openDeleteConfirmModal = () => {

    let _id = this._id;
    let name = this.simulationName;

    const dialogRef = this._matDialog.open(SimulationDeleteConfirmModalComponent, { width: '30%' , data: { name: name } } );

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

  private openDeleteNotificationModal = (name: string) => {

    const dialogRef = this._matDialog.open(SimulationDeletedModalComponent, { width: '30%' , data: { name: name } } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.router.navigate(['/', 'home-page']);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

}
