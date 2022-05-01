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

  behaviorModelList: BehaviorModel[] = [];
  dataSource: any;
  columns = ['name', 'creationDate', 'options'];
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  filterInput: string = "";

  constructor(private _behaviorModelService: BehaviorModelService) { }

  ngOnInit(): void {
    this.getBehaviorModels();
  }

  getBehaviorModels() {
    this._behaviorModelService.getBehaviorModels().subscribe((data: any) => {
      this.behaviorModelList = data;
      for (let i = 0; i < this.behaviorModelList.length; i++) {
        this.behaviorModelList[i].creationDate = dayjs(this.behaviorModelList[i].creationDate).format('YYYY/MM/DD HH:mm:ss');
      }
      this.dataSource = new MatTableDataSource<BehaviorModel>(this.behaviorModelList);
      this.dataSource.sort = this.sort;
    }, (error: any) => {
      console.log(error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeFilter() {
    this.filterInput = "";
    this.dataSource.filter = "";
  }

}