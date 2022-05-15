import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-behavior-model-list',
  templateUrl: './behavior-model-list.component.html',
  styleUrls: ['./behavior-model-list.component.css']
})

export class BehaviorModelListComponent implements OnInit {

  private behaviorModelList: BehaviorModel[] = [];
  public dataSource: any;
  public columns = ['name', 'creationDate', 'options'];
  public filterInput: string = "";

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;

  constructor(private _behaviorModelService: BehaviorModelService) {
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

}