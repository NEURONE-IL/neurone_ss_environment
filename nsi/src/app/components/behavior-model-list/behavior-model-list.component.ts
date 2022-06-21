import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';
import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { BehaviorModelCopiedModalComponent } from '../behavior-model-copied-modal/behavior-model-copied-modal.component';
import { BehaviorModelDeleteConfirmModalComponent } from '../behavior-model-delete-confirm-modal/behavior-model-delete-confirm-modal.component';
import { BehaviorModelDeletedModalComponent } from '../behavior-model-deleted-modal/behavior-model-deleted-modal.component';
import { BehaviorModelInUseModalComponent} from '../behavior-model-in-use-modal/behavior-model-in-use-modal.component';

@Component({
  selector: 'app-behavior-model-list',
  templateUrl: './behavior-model-list.component.html',
  styleUrls: ['./behavior-model-list.component.css']
})

export class BehaviorModelListComponent implements OnInit {

  private behaviorModelList: BehaviorModel[] = [];
  public dataSource: any;
  public columns = ['name', 'creationDate', 'valid', 'options'];
  public filterInput: string = "";
  private firstSort = true;
  private simulationBehaviorModels: any; // ARREGLAR TIPO DE DATOS

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _behaviorModelService: BehaviorModelService,
              private _simulationService: SimulationService,
              private router: Router,
              private _matDialog: MatDialog) {
  }

  async ngOnInit() {
    this.getBehaviorModels();
    this.simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();
  }

  private getBehaviorModels = () => {

    this._behaviorModelService.getBehaviorModels().subscribe((data: BehaviorModel[]) => {

      this.behaviorModelList = data;

      for (let i = 0; i < this.behaviorModelList.length; i++) {
        this.behaviorModelList[i].creationDate = dayjs(this.behaviorModelList[i].creationDate).format('YYYY/MM/DD HH:mm:ss');
      }

      this.dataSource = new MatTableDataSource<BehaviorModel>(this.behaviorModelList);
      if (this.firstSort === true) {
        this.sort.sort(({ id: 'creationDate', start: 'desc'}) as MatSortable);
        this.firstSort = false;
      }
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: BehaviorModel, filter: string) => data.name.toLowerCase().includes(filter);
    this.dataSource.paginator = this.paginator;

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

    for (i = 0; i < this.behaviorModelList.length; i++) {
      if (this.behaviorModelList[i]._id === _id) {
        break;
      }
    }

    let newName = this.behaviorModelList[i].name.concat(" copy");
    let nameAlreadyExists = true;
    let copyCount = 1;

    let j = 0;

    while (nameAlreadyExists == true) {   
      nameAlreadyExists = false;
      for (j = 0; j < this.behaviorModelList.length; j++) {
        if (this.behaviorModelList[j].name.toLowerCase() === newName.trim().toLowerCase()) {
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

    const BEHAVIORMODEL: BehaviorModel = {
      name: newName,
      fullModel: this.behaviorModelList[i].fullModel,
      simulatorModel: this.behaviorModelList[i].simulatorModel,
      modelWidth: this.behaviorModelList[i].modelWidth,
      modelHeight: this.behaviorModelList[i].modelHeight,
      valid: this.behaviorModelList[i].valid,
      creationDate: creationDate,
      lastModificationDate: creationDate
    }

    this._behaviorModelService.createBehaviorModel(BEHAVIORMODEL).subscribe(data => {
      console.log("Behavior model copied");
      const dialogRef = this._matDialog.open(BehaviorModelCopiedModalComponent, { width: '30%' , data: { name: name } } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
        this.filterInput = "";
        this.getBehaviorModels();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    }), (error: any) => {
      console.log(error);
      this.getBehaviorModels();
    }

  }

  public openDeleteConfirmModal = (_id: string, name: string) => {

    let modelIsInUse = false;
    let simulationNamesUsingModels: string[] = [];

    for (let i = 0; i < this.simulationBehaviorModels.length; i++) {
      if (this.simulationBehaviorModels[i].simulationBehaviorModelId === _id) {
        modelIsInUse = true;
        simulationNamesUsingModels.push(this.simulationBehaviorModels[i].simulationName);
      }
    }

    if (modelIsInUse == true) {

      const dialogRef = this._matDialog.open(BehaviorModelInUseModalComponent, { width: '45%' , data: { name: name, simulationNamesUsingModels: simulationNamesUsingModels } } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(async () => {
        dialogRef.close();
        this.simulationBehaviorModels = await this._simulationService.getSimulationBehaviorModels().toPromise();
      });

      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });

    } else {

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

  }

  private openDeleteNotificationModal = (name: string) => {

    const dialogRef = this._matDialog.open(BehaviorModelDeletedModalComponent, { width: '30%' , data: { name: name } } );

    const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
      dialogRef.close();
      this.getBehaviorModels();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  public goToEditBehaviorModel = (_id: string) => {
    this.router.navigate(['/', 'behavior-model-settings'], { state:
      { _id: _id
    }});
  }

}