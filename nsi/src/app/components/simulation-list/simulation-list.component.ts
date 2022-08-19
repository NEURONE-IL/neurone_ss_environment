import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';

import { SimulationModalCopiedComponent } from '../simulation-modal-copied/simulation-modal-copied.component';
import { SimulationModalConfirmDeleteComponent } from '../simulation-modal-confirmdelete/simulation-modal-confirmdelete.component';
import { SimulationModalDeletedComponent } from '../simulation-modal-deleted/simulation-modal-deleted.component';
import { SimulationModalNoModelsComponent } from '../simulation-modal-nomodels/simulation-modal-nomodels.component';
import { SimulationModalNotDeployableComponent} from '../simulation-modal-notdeployable/simulation-modal-notdeployable.component';
import { SimulationModalSimNotFoundComponent } from '../simulation-modal-simnotfound/simulation-modal-simnotfound.component';

import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css']
})

// List of simulations presented in the home page
export class SimulationListComponent implements OnInit {

  private simulationList: Simulation[] = [];
  public columns = ['name', 'creationDate', 'lastDeployDate', 'numberStudents', 'deployOptions', 'otherOptions'];
  public dataSource: any;
  public filterInput: string = "";
  private firstSort = true;
  private dayjsFormat = $localize`:Date format for Dayjs library:YYYY/MM/DD HH:mm:ss`;
  private neverDeployedText = $localize`:Text to describe a simulation that has never been deployed:Never`;
  private copyText = $localize`:Text to append to the name of an existing element to describe a copy that will be made of it:copy`;

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Constructor: Injects dependencies
  constructor(private _simulationService: SimulationService,
              private _matDialog: MatDialog,
              private router: Router,
              private _behaviorModelService: BehaviorModelService)
  { }

  // ngOnInit: Gets the simulations needed to populate the list of simulations
  ngOnInit(): void {
    this.getSimulations();
  }

  // Gets the simulation data needed to populate the simulations table, and prepares the sorting method for the table
  private getSimulations = () => {
    this._simulationService.getSimulations().subscribe((data: Simulation[]) => {

      this.simulationList = data;

      for (let i = 0; i < this.simulationList.length; i++) {

        this.simulationList[i].creationDate = dayjs(this.simulationList[i].creationDate).format(this.dayjsFormat);
        var lastDeployDate = new Date(this.simulationList[i].lastDeployDate).getTime();

        if (lastDeployDate != 0) {
          this.simulationList[i].lastDeployDate = dayjs(this.simulationList[i].lastDeployDate).format(this.dayjsFormat);
        } else {
          this.simulationList[i].lastDeployDate = this.neverDeployedText;
        }

      }    

      this.dataSource = new MatTableDataSource<Simulation>(this.simulationList);
      if (this.firstSort === true) {
        this.sort.sort(({ id: 'creationDate', start: 'desc'}) as MatSortable);
        this.firstSort = false;
      }
      this.dataSource.sort = this.sort;

      this.dataSource.sortData = (data: Simulation[], sort: MatSort) => {
        return data.sort((a: Simulation, b: Simulation): number => {
          if (this.sort.active === "name") {
            if (this.sort.direction === "asc") {
              return Number(a.name.toLowerCase() > b.name.toLowerCase());
            } else if (this.sort.direction === "desc") {
              return Number(b.name.toLowerCase() > a.name.toLowerCase());
            }
          }
          else if (this.sort.active === "creationDate") {
            if (this.sort.direction === "asc") {
              return dayjs(a.creationDate, this.dayjsFormat).toDate().getTime() - dayjs(b.creationDate, this.dayjsFormat).toDate().getTime();
            } else if (this.sort.direction === "desc") {
              return dayjs(b.creationDate, this.dayjsFormat).toDate().getTime() - dayjs(a.creationDate, this.dayjsFormat).toDate().getTime();
            }
          }
          else if (this.sort.active === "lastDeployDate") {
            if (this.sort.direction === "asc") {
              if ((a.lastDeployDate === this.neverDeployedText) && (b.lastDeployDate === this.neverDeployedText)) {
                return 0;
              } else if ((a.lastDeployDate !== this.neverDeployedText) && (b.lastDeployDate === this.neverDeployedText)) {
                return 1;
              } else if ((a.lastDeployDate === this.neverDeployedText) && (b.lastDeployDate !== this.neverDeployedText)) {
                return -1;
              } else {
                return dayjs(a.lastDeployDate, this.dayjsFormat).toDate().getTime() - dayjs(b.lastDeployDate, this.dayjsFormat).toDate().getTime();
              }
            } else if (this.sort.direction === "desc") {
              if ((a.lastDeployDate === this.neverDeployedText) && (b.lastDeployDate === this.neverDeployedText)) {
                return 0;
              } else if ((a.lastDeployDate !== this.neverDeployedText) && (b.lastDeployDate === this.neverDeployedText)) {
                return -1;
              } else if ((a.lastDeployDate === this.neverDeployedText) && (b.lastDeployDate !== this.neverDeployedText)) {
                return 1;
              } else {
                return dayjs(b.lastDeployDate, this.dayjsFormat).toDate().getTime() - dayjs(a.lastDeployDate, this.dayjsFormat).toDate().getTime();
              }
            }
          }
          else if (this.sort.active === "numberStudents") {
            if (this.sort.direction === "asc") {
              return Number(a.numberStudents > b.numberStudents);
            } else if (this.sort.direction === "desc") {
              return Number(b.numberStudents > a.numberStudents);
            }
          }
          return 0;
        });
      }

      this.dataSource.filterPredicate = (data: Simulation, filter: string) => data.name.toLowerCase().includes(filter);
      this.dataSource.paginator = this.paginator;
    }, (error: any) => {
      console.log(error);
    })
  }

  // Applies a filter to the list of simulations
  public applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Removes the filter applied to the list of simulations
  public removeFilter = () => {
    this.filterInput = "";
    this.dataSource.filter = "";
  }

  // Opens the modal that lets the user know that the simulation has been copied
  public openCopyNotificationModal = async (_id: string, name: string) => {
    try {
      let simulationToCopy = await this._simulationService.getSimulation(_id).toPromise();
    } catch (error: any) {
      if (error.status == 404) {
        const dialogRef = this._matDialog.open(SimulationModalSimNotFoundComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getSimulations();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      } else {
        const dialogRef = this._matDialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getSimulations();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }
    }

    this._simulationService.copySimulation(_id, this.copyText).subscribe(data => {
      const dialogRef = this._matDialog.open(SimulationModalCopiedComponent, { width: '30%' , data: { name: name }, disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.filterInput = "";
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

  // Opens the modal that asks the user to confirm he wants to delete a simulation
  public openDeleteConfirmModal = (_id: string, name: string) => {
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

  // Opens the modal that lets the user know that the simulation has been deleted
  private openDeleteNotificationModal = (name: string) => {
    const dialogRef = this._matDialog.open(SimulationModalDeletedComponent, { width: '30%' , data: { name: name }, disableClose: true } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.getSimulations();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Navigates to the simulation settings component
  public goToSimulationSettings = async (_id: string) => {
    try {
      let simulation = await this._simulationService.getSimulation(_id).toPromise();
    } catch (error: any) {
      if (error.status == 404) {
        const dialogRef = this._matDialog.open(SimulationModalSimNotFoundComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getSimulations();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      } else {
        const dialogRef = this._matDialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getSimulations();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }

      return;
    }

    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: _id
    }});
  }

  // Navigates to the new simulation component, provided at least one behavior model has been created
  public goToNewSimulation = async () => {
    let behaviorModelsProperties = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();

    if (behaviorModelsProperties.length == 0) {
      const dialogRef = this._matDialog.open(SimulationModalNoModelsComponent, { width: '30%', disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.router.navigate(['/', 'simulation-new']);
    }
  }

  // Navigates to the simulation deploy component
  public deploySimulation = async (_id: string) => {
    try {
      let simulation = await this._simulationService.getSimulation(_id).toPromise();
    } catch (error: any) {
      if (error.status == 404) {
        const dialogRef = this._matDialog.open(SimulationModalSimNotFoundComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getSimulations();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      } else {
        const dialogRef = this._matDialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.router.navigate(['/', 'home']);
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }

      return;
    }

    let behaviorModelId: string = '';
    let simulationBehaviorModelValid = false;
    let simulationBehaviorModelName: string = '';
    for (let i = 0; i < this.simulationList.length; i++) {
      if (this.simulationList[i]._id === _id) {
        behaviorModelId = this.simulationList[i].behaviorModelId;
      }
    }
    let behaviorModelsProperties = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();
    for (let i = 0; i < behaviorModelsProperties.length; i++) {
      if (behaviorModelsProperties[i]._id === behaviorModelId) {
        simulationBehaviorModelValid = behaviorModelsProperties[i].valid;
        simulationBehaviorModelName = behaviorModelsProperties[i].name;
      }
    }
    if (simulationBehaviorModelValid == false) {
      const dialogRef = this._matDialog.open(SimulationModalNotDeployableComponent, { width: '45%' , data: { behaviorModelName: simulationBehaviorModelName } } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.router.navigate(['/', 'simulation-deploy'], { state:
        { _id: _id
       }});
    }
  }

}