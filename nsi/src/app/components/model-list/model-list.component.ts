import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})

export class ModelListComponent {

  columns: string[] = ['name', 'creator', 'creationDate'];

  data: Model[] = [
    new Model('Model1', 'John', dayjs(new Date(2015, 11, 17, 13, 24, 2)).format('YYYY/MM/DD HH:mm:ss')),
    new Model('Model2', 'George', dayjs(new Date(2016, 11, 1, 15, 2, 10)).format('YYYY/MM/DD HH:mm:ss')),
    new Model('Model3', 'Paul', dayjs(new Date(2018, 11, 23, 8, 51, 55)).format('YYYY/MM/DD HH:mm:ss')),
    new Model('Model4', 'Ringo', dayjs(new Date(2018, 11, 23, 9, 36, 33)).format('YYYY/MM/DD HH:mm:ss'))
  ];

  dataSource: any;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Model>(this.data);
    this.dataSource.sort = this.sort;
  }
}

export class Model {

  constructor(public name: string, public creator: string, public creationDate: string) {
  }

}