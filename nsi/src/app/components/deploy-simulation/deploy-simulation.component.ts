import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table'; //INNECESARIO CON EL IMPORT DE ARRIBA
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { SimulationDeployService } from '../../services/simulation-deploy.service';

import { CdTimerModule } from 'angular-cd-timer';

@Component({
  selector: 'app-deploy-simulation',
  templateUrl: './deploy-simulation.component.html',
  styleUrls: ['./deploy-simulation.component.css']
})

export class DeploySimulationComponent implements OnInit {

  private _id: string = '';
  public status: string = 'Stopped';
  public simulationName: string = '';
  public deployEnabled: boolean = true;
  public stopEnabled: boolean = false;
  public restartEnabled: boolean = false;
  public endTime: number = 0;
  public showMaxLengthReached: boolean = false;

  private actionsList: Action[] = [];

  private bookmarksList: Bookmark[] = [];
  private keystrokesList: Keystroke[] = [];
  private queriesList: Query[] = [];
  private visitedlinksList: Visitedlink[] = [];

  public columns = ['username', 'action', 'localTimestamp'];
  public dataSource: any;
  public filterInput: string = "";

  private bookmarksCursor: number = 0;
  private keystrokesCursor: number = 0;
  private queriesCursor: number = 0;
  private visitedlinksCursor: number = 0;

  private updateFrequency: number = 5000;

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;
  @ViewChild(MatTable, {static: true}) private ActionsTableRef!: MatTable<any>;
  @ViewChild('basicTimer') private timerRef!: any;
  @ViewChild('actionText') actionTextRef!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _simulationService: SimulationService, private _behaviorModelService: BehaviorModelService, private _simulationDeployService: SimulationDeployService, private router: Router, private _renderer2: Renderer2) {

      if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
        this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
      } else {
        this.router.navigate(['/', 'home']);
      }

  }

  async ngOnInit() {

    let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    this.simulationName = simulation.name;
    this.endTime = simulation.length * 60;

    this.dataSource = new MatTableDataSource<Action>(this.actionsList);
    this.dataSource.filterPredicate = (data: Action, filter: string) => data.username === filter;

    this.timerRef.stop();

    this.dataSource.paginator = this.paginator;

  }

  public goToSimulationSettings = () => {
    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: this._id
    }});
  }

  public applyFilter = (event: Event) => {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.paginator.firstPage();

  }

  public removeFilter = () => {

    this.filterInput = "";
    this.dataSource.filter = "";
    this.paginator.firstPage();

  }

  async ngOnDestroy() {
    this.stop();
  }

  public async deploy() {

    this.showMaxLengthReached = false;
    this.timerRef.reset();
    this.timerRef.start();

    this.actionsList.length = 0;
    this.bookmarksList.length = 0;
    this.keystrokesList.length = 0;
    this.queriesList.length = 0;
    this.visitedlinksList.length = 0;
    this.ActionsTableRef.renderRows();
    this.dataSource._updateChangeSubscription();

    this.deployEnabled = false;
    this.status = "Deploying...";
    let status = await this._simulationDeployService.startSimulation(this._id).toPromise();

    console.log(status);
    this.status = "Deployed"
    this.stopEnabled = true;
    this.restartEnabled = true;

    this.updateActions();

    let updateLastDeployDate = await this._simulationService.updateSimulationLastDeployDate(this._id).toPromise();

    // ENVIAR JSON A SIMULADOR Y DESPLEGAR SIMULACION; ESPERAR AVISO DE QUE SE DESPLEGO SIMULACION
  }

  private async updateActions() {
    while (this.status === "Deployed") {
      await new Promise(f => setTimeout(f, this.updateFrequency));
      if (this.status !== "Deployed") {
        break;
      }

      let latestBookmarks = await this._simulationDeployService.getLatestBookmarks(this.bookmarksCursor).toPromise();
      let latestKeystrokes = await this._simulationDeployService.getLatestKeystrokes(this.keystrokesCursor).toPromise();
      let latestQueries = await this._simulationDeployService.getLatestQueries(this.queriesCursor).toPromise();
      let latestVisitedlinks = await this._simulationDeployService.getLatestVisitedlinks(this.visitedlinksCursor).toPromise();

      if (latestBookmarks.length > 0) {
        this.bookmarksCursor = latestBookmarks[latestBookmarks.length - 1].localTimestamp;
      }

      if (latestKeystrokes.length > 0) {
        this.keystrokesCursor = latestKeystrokes[latestKeystrokes.length - 1].localTimestamp;
      }

      if (latestQueries.length > 0) {
        this.queriesCursor = latestQueries[latestQueries.length - 1].localTimestamp;
      }

      if (latestVisitedlinks.length > 0) {
        this.visitedlinksCursor = latestVisitedlinks[latestVisitedlinks.length - 1].localTimestamp;
      }
       
      let tempActionsList: Action[] = [];

      for (let i = 0; i < latestBookmarks.length; i++) {
        let timestamp = dayjs(latestBookmarks[i].localTimestamp).format('YYYY/MM/DD HH:mm:ss');
        if (latestBookmarks[i].action === "Bookmark") {
          tempActionsList.push({'username': latestBookmarks[i].username.substr(11), 'action': 'Student bookmarked document "'.concat(latestBookmarks[i].url).concat('"'), 'localTimestamp': timestamp, 'type': 'B'});
        } else {
          tempActionsList.push({'username': latestBookmarks[i].username.substr(11), 'action': 'Student unbookmarked document "'.concat(latestBookmarks[i].url).concat('"'), 'localTimestamp': timestamp, 'type': 'B'});
        }
      }

      for (let i = 0; i < latestKeystrokes.length; i++) {
        let timestamp = dayjs(latestKeystrokes[i].localTimestamp).format('YYYY/MM/DD HH:mm:ss');
        tempActionsList.push({'username': latestKeystrokes[i].username.substr(11), 'action': 'Student pressed key with keycode '.concat(latestKeystrokes[i].keyCode.toString()), 'localTimestamp': timestamp, 'type': 'K'});
      }

      for (let i = 0; i < latestQueries.length; i++) {
        let timestamp = dayjs(latestQueries[i].localTimestamp).format('YYYY/MM/DD HH:mm:ss');
        tempActionsList.push({'username': latestQueries[i].username.substr(11), 'action': 'Student queried "'.concat(latestQueries[i].query).concat('"'), 'localTimestamp': timestamp, 'type': 'Q'});
      }

      for (let i = 0; i < latestVisitedlinks.length; i++) {
        let timestamp = dayjs(latestVisitedlinks[i].localTimestamp).format('YYYY/MM/DD HH:mm:ss');

        if (latestVisitedlinks[i].state === "PageEnter") {
          tempActionsList.push({'username': latestVisitedlinks[i].username.substr(11), 'action': 'Student entered page "'.concat(latestVisitedlinks[i].url).concat('"'), 'localTimestamp': timestamp, 'type': 'V'});
        } else {
          tempActionsList.push({'username': latestVisitedlinks[i].username.substr(11), 'action': 'Student exited page "'.concat(latestVisitedlinks[i].url).concat('"'), 'localTimestamp': timestamp, 'type': 'V'});
        }
      }

      tempActionsList.sort((a, b) => Date.parse(a.localTimestamp) - Date.parse(b.localTimestamp));

      for (let i = 0; i < tempActionsList.length; i++) {
        this.actionsList.push(tempActionsList[i]);
      }

      this.ActionsTableRef.renderRows();
      this.dataSource._updateChangeSubscription();
    }
  }

  public async stop() {
    this.showMaxLengthReached = false;
    this.stopEnabled = false;
    this.restartEnabled = false;
    this.status = "Stopping...";
    let status = await this._simulationDeployService.stopSimulation().toPromise();
    console.log(status);
    await new Promise(f => setTimeout(f, 1000));
    this.status = "Stopped"
    this.deployEnabled = true;

    this.timerRef.stop();

    // DETENER SIMULACION; ESPERAR AVISO DE QUE SE DETUVO SIMULACION
  }

  public async restart() {
    this.actionsList.length = 0;
    this.bookmarksList.length = 0;
    this.keystrokesList.length = 0;
    this.queriesList.length = 0;
    this.visitedlinksList.length = 0;
    this.ActionsTableRef.renderRows();
    this.dataSource._updateChangeSubscription();

    this.showMaxLengthReached = false;
    this.restartEnabled = false;
    this.stopEnabled = false;
    this.status = "Restarting...";
    let status = await this._simulationDeployService.stopSimulation().toPromise();

    this.timerRef.stop();
    await new Promise(f => setTimeout(f, 1000));
    this.deploy();
  }

  public triggerStop() {
    if (this.endTime > 0) {
      this.stop();
      this.showMaxLengthReached = true;
    }
  }

}

interface Action {
  username: string,
  action: string,
  localTimestamp: string,
  type: string
}

interface Bookmark {
  _id: string,
  username: string,
  url: string,
  localTimestamp: number,
  action: string,
  docid: string,
  relevant: boolean,
  usermade: boolean
}

interface Keystroke {
  _id: string,
  username: string,
  url: string,
  localTimestamp: number,
  keyCode: number
}

interface Query {
  _id: string,
  username: string,
  url: string,
  localTimestamp: number,
  query: string
}

interface Visitedlink {
  _id: string,
  username: string,
  url: string,
  state: string,
  localTimestamp: number,
  relevant: boolean
}