import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-simulation-list',
  templateUrl: './simulation-list.component.html',
  styleUrls: ['./simulation-list.component.css']
})

export class SimulationListComponent {

  columns: string[] = ['name', 'creator', 'creationDate', 'lastDeployDate', 'numberStudents'];

  data: Simulation[] = [
    new Simulation('Simulation1', 'John', new Date(2015, 11, 17, 13, 24, 2), new Date(2015, 11, 18, 9, 8, 5), 240),
    new Simulation('Simulation2', 'George', new Date(2016, 11, 1, 15, 2, 10), new Date(2016, 11, 3, 11, 59, 55), 120),
    new Simulation('Simulation3', 'Paul', new Date(2018, 11, 23, 8, 51, 55), new Date(2018, 11, 24, 12, 9, 31), 80),
    new Simulation('Simulation3', 'Ringo', new Date(2018, 11, 23, 9, 36, 33), new Date(2018, 11, 25, 17, 45, 24), 100)
  ];

  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Simulation>(this.data);
    this.dataSource.sort = this.sort;
  }
}

export class Simulation {

  constructor(public name: string, public creator: string, public creationDate: Date, public lastDeployDate: Date, public numberStudents: number) {
  }

}