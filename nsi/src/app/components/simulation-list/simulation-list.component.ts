import { Component, OnInit, ViewChild } from '@angular/core';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css']
})

export class SimulationListComponent implements OnInit {

  simulationList: Simulation[] = [];
  dataSource: any;
  columns = ['name', 'creationDate', 'lastDeployDate', 'numberStudents', 'deployOptions', 'otherOptions'];
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  filterInput: string = "";

  constructor(private _simulationService: SimulationService) { }

  ngOnInit(): void {
    this.getSimulations();
  }

  getSimulations() {
    this._simulationService.getSimulations().subscribe((data: any) => {
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