import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { SimulationCopiedModalComponent } from '../simulation-copied-modal/simulation-copied-modal.component';
import { SimulationDeleteConfirmModalComponent } from '../simulation-delete-confirm-modal/simulation-delete-confirm-modal.component';
import { SimulationDeletedModalComponent } from '../simulation-deleted-modal/simulation-deleted-modal.component';
import { SimulationNoValidModelsModalComponent } from '../simulation-no-valid-models-modal/simulation-no-valid-models-modal.component';

@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css']
})

export class SimulationListComponent implements OnInit {

  private simulationList: Simulation[] = [];
  public columns = ['name', 'creationDate', 'lastDeployDate', 'numberStudents', 'deployOptions', 'otherOptions'];
  public dataSource: any;
  public filterInput: string = "";
  private firstSort = true;

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;

  constructor(private _simulationService: SimulationService,
              private _matDialog: MatDialog,
              private router: Router,
              private _behaviorModelService: BehaviorModelService)
  { }

  ngOnInit(): void {

    this.getSimulations();

  }

  private getSimulations = () => {

    this._simulationService.getSimulations().subscribe((data: Simulation[]) => {

      this.simulationList = data;

      for (let i = 0; i < this.simulationList.length; i++) {

        this.simulationList[i].creationDate = dayjs(this.simulationList[i].creationDate).format('YYYY/MM/DD HH:mm:ss');
        var lastDeployDate = new Date(this.simulationList[i].lastDeployDate).getTime();

        if (lastDeployDate != 0) {
          this.simulationList[i].lastDeployDate = dayjs(this.simulationList[i].lastDeployDate).format('YYYY/MM/DD HH:mm:ss');
        } else {
          this.simulationList[i].lastDeployDate = "Never";
        }

      }    

      this.dataSource = new MatTableDataSource<Simulation>(this.simulationList);
      if (this.firstSort === true) {
        this.sort.sort(({ id: 'creationDate', start: 'desc'}) as MatSortable);
        this.firstSort = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Simulation, filter: string) => data.name.includes(filter);
    }, (error: any) => {
      console.log(error);
    })

  }

  public applyFilter = (event: Event) => {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  public removeFilter = () => {

    this.filterInput = "";
    this.dataSource.filter = "";

  }

  public openCopyNotificationModal = (_id: string, name: string) => {

    let i = 0;

    for (i = 0; i < this.simulationList.length; i++) {
      if (this.simulationList[i]._id === _id) {
        break;
      }
    }

    let newName = this.simulationList[i].name.concat(" copy");
    let nameAlreadyExists = true;
    let copyCount = 1;

    let j = 0;

    while (nameAlreadyExists == true) {   
      nameAlreadyExists = false;
      for (j = 0; j < this.simulationList.length; j++) {
        if (this.simulationList[j].name.toLowerCase() === newName.trim().toLowerCase()) {
          nameAlreadyExists = true;
          copyCount = copyCount + 1;
          if (newName.slice(-4) !== "copy") {
            newName = newName.substring(0, newName.lastIndexOf(" "));
          }
          newName = newName.concat(" " + copyCount.toString());
          break;
        }
      }
    }

    let creationDate = (new Date(Date.now())).toString();

    const SIMULATION: Simulation = {
      name: newName,
      description: this.simulationList[i].description,
      numberStudents: this.simulationList[i].numberStudents,
      numberDocuments: this.simulationList[i].numberDocuments,
      numberRelevantDocuments: this.simulationList[i].numberRelevantDocuments,
      randomActions: this.simulationList[i].randomActions,
      expiration: this.simulationList[i].expiration,
      queryList: Object.assign([], this.simulationList[i].queryList),
      behaviorModelId: this.simulationList[i].behaviorModelId,
      length: this.simulationList[i].length,
      sensibility: this.simulationList[i].sensibility,
      interval: this.simulationList[i].interval,
      speed: this.simulationList[i].speed,
      creationDate: creationDate,
      lastDeployDate: (new Date(0)).toString(),
      lastModificationDate: creationDate
    }

    this._simulationService.createSimulation(SIMULATION).subscribe(data => {
      console.log("Simulation copied");
      const dialogRef = this._matDialog.open(SimulationCopiedModalComponent, { width: '30%' , data: { name: name } } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.getSimulations();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }), (error: any) => {
      console.log(error);
      this.getSimulations();
    }

  }

  public openDeleteConfirmModal = (_id: string, name: string) => {

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
      this.getSimulations();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  public goToSimulationSettings = (_id: string) => {
    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: _id
     }});
  }

  public async goToNewSimulation() {
    let behaviorModelsProperties = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();
    let behaviorModelsPropertiesFiltered = behaviorModelsProperties.filter(function(obj: any) { //FALTA INTERFAZ PARA NO PONER ANY
      return obj.valid != false;
    });

    if (behaviorModelsPropertiesFiltered.length == 0) {
      const dialogRef = this._matDialog.open(SimulationNoValidModelsModalComponent, { width: '30%' } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.router.navigate(['/', 'new-simulation']);
    }
  }

}