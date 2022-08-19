import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';
import { SimulationService } from '../../services/simulation.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { BehaviorModelModalCopiedComponent } from '../behaviormodel-modal-copied/behaviormodel-modal-copied.component';
import { BehaviorModelModalConfirmDeleteComponent } from '../behaviormodel-modal-confirmdelete/behaviormodel-modal-confirmdelete.component';
import { BehaviorModelModalDeletedComponent } from '../behaviormodel-modal-deleted/behaviormodel-modal-deleted.component';
import { BehaviorModelModalInUseComponent } from '../behaviormodel-modal-inuse/behaviormodel-modal-inuse.component';
import { BehaviorModelModalNotFoundComponent } from '../behaviormodel-modal-notfound/behaviormodel-modal-notfound.component';

import { ModalErrorComponent } from '../modal-error/modal-error.component';

// Interface to handle the behavior model properties to be displayed on the behavior models list
interface behaviorModelProperties {
  _id: string,
  name: string,
  valid: boolean,
  creationDate: string
}

@Component({
  selector: 'app-behaviormodel-list',
  templateUrl: './behaviormodel-list.component.html',
  styleUrls: ['./behaviormodel-list.component.css']
})

// List of behavior models presented in the home page
export class BehaviorModelListComponent implements OnInit {

  private behaviorModelList: behaviorModelProperties[] = [];
  public dataSource: any;
  public columns = ['name', 'creationDate', 'valid', 'options'];
  public filterInput: string = "";
  private firstSort = true;
  private simulationBehaviorModels: any;
  private dayjsFormat = $localize`:Date format for Dayjs library:YYYY/MM/DD HH:mm:ss`;
  private copyText = $localize`:Text to append to the name of an existing element to describe a copy that will be made of it:copy`;

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Constructor: Injects dependencies
  constructor(private _behaviorModelService: BehaviorModelService,
              private _simulationService: SimulationService,
              private router: Router,
              private _matDialog: MatDialog) {
  }

  // ngOnInit: Gets the metadata of the behavior models, and the list of simulations with their behavior model IDs, to know if a specific behavior model may or not be deleted
  async ngOnInit() {
    this.getBehaviorModelsProperties();
    this.simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();
  }

  // Gets the metadata of the behavior models to populate the models table, and prepares the sorting method for the table
  private getBehaviorModelsProperties = () => {
    this._behaviorModelService.getBehaviorModelsProperties().subscribe((data: behaviorModelProperties[]) => {

      this.behaviorModelList = data;

      for (let i = 0; i < this.behaviorModelList.length; i++) {
        this.behaviorModelList[i].creationDate = dayjs(this.behaviorModelList[i].creationDate).format(this.dayjsFormat);
      }

      this.dataSource = new MatTableDataSource<behaviorModelProperties>(this.behaviorModelList);
      if (this.firstSort === true) {
        this.sort.sort(({ id: 'creationDate', start: 'desc'}) as MatSortable);
        this.firstSort = false;
      }
      this.dataSource.sort = this.sort;

      this.dataSource.sortData = (data: behaviorModelProperties[], sort: MatSort) => {
        return data.sort((a: behaviorModelProperties, b: behaviorModelProperties): number => {
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
          else if (this.sort.active === "valid") {
            if (this.sort.direction === "asc") {
              return Number(a.valid) - Number(b.valid);
            } else if (this.sort.direction === "desc") {
              return Number(b.valid) - Number(a.valid);
            }
          }
          return 0;
        });
      }

      this.dataSource.filterPredicate = (data: behaviorModelProperties, filter: string) => data.name.toLowerCase().includes(filter);
      this.dataSource.paginator = this.paginator;

    }, (error: any) => {
      console.log(error);
    })
  }

  // Applies the filter of the behavior model list
  public applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Removes the filter of the behavior model list
  public removeFilter = () => {
    this.filterInput = "";
    this.dataSource.filter = "";
  }

  // Makes a copy of a behavior model, and opens the modal that lets the user know that the model has been copied
  public openCopyNotificationModal = async (_id: string, name: string) => {
    try {
      let behaviorModelToCopy = await this._behaviorModelService.getBehaviorModel(_id).toPromise();
    } catch (error: any) {
      if (error.status == 404) {
        const dialogRef = this._matDialog.open(BehaviorModelModalNotFoundComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getBehaviorModelsProperties();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      } else {
        const dialogRef = this._matDialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getBehaviorModelsProperties();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }
    }
  
    this._behaviorModelService.copyBehaviorModel(_id, this.copyText).subscribe(data => {
      const dialogRef = this._matDialog.open(BehaviorModelModalCopiedComponent, { width: '30%' , data: { name: name }, disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.filterInput = "";
        this.getBehaviorModelsProperties();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }), (error: any) => {
      console.log(error);
      this.getBehaviorModelsProperties();
    }
  }

  // Opens the modal that asks the user to confirm he wants to delete a behavior model, or the modal that tells the user that said behavior model cannot be deleted
  public openDeleteConfirmModal = async (_id: string, name: string) => {
    let modelIsInUse = false;
    let simulationNamesUsingModels: string[] = [];
    this.simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();

    for (let i = 0; i < this.simulationBehaviorModels.length; i++) {
      if (this.simulationBehaviorModels[i].simulationBehaviorModelId === _id) {
        modelIsInUse = true;
        simulationNamesUsingModels.push(this.simulationBehaviorModels[i].simulationName);
      }
    }

    if (modelIsInUse == true) {

      const dialogRef = this._matDialog.open(BehaviorModelModalInUseComponent, { width: '45%' , data: { name: name, simulationNamesUsingModels: simulationNamesUsingModels }, disableClose: true } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(async () => {
        dialogRef.close();
        this.simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();
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

  // Opens the modal that lets the user know that the model has been deleted
  private openDeleteNotificationModal = (name: string) => {
    const dialogRef = this._matDialog.open(BehaviorModelModalDeletedComponent, { width: '30%' , data: { name: name }, disableClose: true } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.getBehaviorModelsProperties();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Navigates to the behavior model settings component
  public goToBehaviorModelSettings = async (_id: string) => {
    try {
      let behaviorModel = await this._behaviorModelService.getBehaviorModel(_id).toPromise();
    } catch (error: any) {
      if (error.status == 404) {
        const dialogRef = this._matDialog.open(BehaviorModelModalNotFoundComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getBehaviorModelsProperties();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      } else {
        const dialogRef = this._matDialog.open(ModalErrorComponent, { width: '30%', disableClose: true } );

        const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
          dialogRef.close();
          this.filterInput = "";
          this.getBehaviorModelsProperties();
        });

        dialogRef.afterClosed().subscribe(() => {
          sub.unsubscribe();
        });
      }

      return;
    }

    this.router.navigate(['/', 'behaviormodel-settings'], { state:
      { _id: _id
    }});
  }

}




