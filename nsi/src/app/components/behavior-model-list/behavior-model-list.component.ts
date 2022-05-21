import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BehaviorModelCopiedModalComponent } from '../behavior-model-copied-modal/behavior-model-copied-modal.component';
import { BehaviorModelDeleteConfirmModalComponent } from '../behavior-model-delete-confirm-modal/behavior-model-delete-confirm-modal.component';
import { BehaviorModelDeletedModalComponent } from '../behavior-model-deleted-modal/behavior-model-deleted-modal.component';

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

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;

  constructor(private _behaviorModelService: BehaviorModelService,
              private _matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getBehaviorModels();
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
      this.dataSource.filterPredicate = (data: BehaviorModel, filter: string) => data.name.includes(filter);

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
        if (this.behaviorModelList[j].name === newName.trim().toLowerCase()) {
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

    const BEHAVIORMODEL: BehaviorModel = {
      name: newName,
      model: '{}',
      valid: this.behaviorModelList[i].valid,
      creationDate: (new Date(Date.now())).toString()
    }

    this._behaviorModelService.createBehaviorModel(BEHAVIORMODEL).subscribe(data => {
      console.log("Behavior model copied");
      const dialogRef = this._matDialog.open(BehaviorModelCopiedModalComponent, { width: '30%' , data: { name: name } } );

      const sub = dialogRef.componentInstance.onSubmit.subscribe(() => {
        dialogRef.close();
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
      this.getBehaviorModels();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

}